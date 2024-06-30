import time
from PIL import Image
import requests
import random
import string
import hashlib
import hmac
import base64
import urllib.parse
import json
import uuid
from flask import Flask, request, jsonify
import chat
from flask_cors import CORS

# 请注意替换APP_ID、APP_KEY
APP_ID = '3033143447'
APP_KEY = 'WmamMsxolXmkqgtS'
DOMAIN = 'api-ai.vivo.com.cn'

app = Flask(__name__)
CORS(app)  # 允许所有来源的请求


# 随机字符串
def gen_nonce(length=8):
    chars = string.ascii_lowercase + string.digits
    return ''.join([random.choice(chars) for _ in range(length)])


# 如果query项只有key没有value时，转换成params[key] = ''传入
def gen_canonical_query_string(params):
    if params:
        escape_uri = urllib.parse.quote
        raw = []
        for k in sorted(params.keys()):
            tmp_tuple = (escape_uri(k), escape_uri(str(params[k])))
            raw.append(tmp_tuple)
        s = "&".join("=".join(kv) for kv in raw)
        return s
    else:
        return ''


def gen_signature(app_secret, signing_string):
    bytes_secret = app_secret.encode('utf-8')
    hash_obj = hmac.new(bytes_secret, signing_string, hashlib.sha256)
    bytes_sig = base64.b64encode(hash_obj.digest())
    signature = str(bytes_sig, encoding='utf-8')
    return signature


def gen_sign_headers(app_id, app_key, method, uri, query):
    method = str(method).upper()
    uri = uri
    timestamp = str(int(time.time()))
    app_id = app_id
    app_key = app_key
    nonce = gen_nonce()
    canonical_query_string = gen_canonical_query_string(query)
    signed_headers_string = 'x-ai-gateway-app-id:{}\nx-ai-gateway-timestamp:{}\n' \
                            'x-ai-gateway-nonce:{}'.format(app_id, timestamp, nonce)
    signing_string = '{}\n{}\n{}\n{}\n{}\n{}'.format(method,
                                                     uri,
                                                     canonical_query_string,
                                                     app_id,
                                                     timestamp,
                                                     signed_headers_string)
    signing_string = signing_string.encode('utf-8')
    signature = gen_signature(app_key, signing_string)
    return {
        'X-AI-GATEWAY-APP-ID': app_id,
        'X-AI-GATEWAY-TIMESTAMP': timestamp,
        'X-AI-GATEWAY-NONCE': nonce,
        'X-AI-GATEWAY-SIGNED-HEADERS': "x-ai-gateway-app-id;x-ai-gateway-timestamp;x-ai-gateway-nonce",
        'X-AI-GATEWAY-SIGNATURE': signature
    }


# 发送作画请求,传入的参数分别是作图要求，风格，图片高，图片宽
def submit(pro, height, width):
    METHOD = 'POST'
    URI = '/api/v1/task_submit'
    params = {}
    data = {
        'height': height,
        'width': width,
        'prompt': pro,
        'styleConfig': '55c682d5eeca50d4806fd1cba3628781'
    }

    headers = gen_sign_headers(APP_ID, APP_KEY, METHOD, URI, params)
    headers['Content-Type'] = 'application/json'

    url = 'http://{}{}'.format(DOMAIN, URI)
    response = requests.post(url, data=json.dumps(data), headers=headers)
    if response.status_code == 200:
        print(response.json())
        response_json = response.json()
        taskid = response_json['result']['task_id']
    else:
        print(response.status_code, response.text)
    return taskid


# 接收作画结果
def progress(taskid):
    METHOD = 'GET'
    URI = '/api/v1/task_progress'
    params = {
        # 注意替换为提交作画任务时返回的task_id
        'task_id': taskid
    }
    headers = gen_sign_headers(APP_ID, APP_KEY, METHOD, URI, params)

    uri_params = ''
    for key, value in params.items():
        uri_params = uri_params + key + '=' + value + '&'
    uri_params = uri_params[:-1]

    url = 'http://{}{}?{}'.format(DOMAIN, URI, uri_params)
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return response.json()


pro1=""
pro2=""
pro3=""


@app.route('/paint', methods=['POST'])
def paint():
    print("1")
    data = request.json
    print(data)
    height = "576"
    width = "768"
    pro = data.get('prompt', 'default_prompt')
    global pro1,pro2,pro3
    pro1 = chat.transform_1(pro)
    pro2 = chat.transform_2(pro)
    pro3 = chat.transform_3(pro)
    taskid1 = submit(pro1, height, width)
    taskid2 = submit(pro2, height, width)
    taskid3 = submit(pro3, height, width)
    x1 = progress(taskid1)
    x2 = progress(taskid2)
    x3 = progress(taskid3)
    t1 = x1['result']['finished']
    t2 = x2['result']['finished']
    t3 = x3['result']['finished']
    print("正在作图中......")
    while t1 == False or t2 == False or t3 == False:
        time.sleep(1)
        x1 = progress(taskid1)
        time.sleep(1)
        x2 = progress(taskid2)
        time.sleep(1)
        x3 = progress(taskid3)
        t1 = x1['result']['finished']
        t2 = x2['result']['finished']
        t3 = x3['result']['finished']
        print("......")
    url1 = x1['result']['images_url'][0]
    url2 = x2['result']['images_url'][0]
    url3 = x3['result']['images_url'][0]
    response1 = requests.get(url1)
    response2 = requests.get(url2)
    response3 = requests.get(url3)
    urls = {
        'url1': url1,
        'url2': url2,
        'url3': url3
    }
    # 使用jsonify来将字典转换为JSON格式的响应
    return jsonify(urls)

@app.route('/remake', methods=['POST'])
def remake():
    height = "576"
    width = "768"
    global pro1, pro2, pro3
    pro1 = chat.transform_1(pro3)
    pro2 = chat.transform_2(pro3)
    pro3 = chat.transform_3(pro3)
    taskid1 = submit(pro1, height, width)
    taskid2 = submit(pro2, height, width)
    taskid3 = submit(pro3, height, width)
    x1 = progress(taskid1)
    x2 = progress(taskid2)
    x3 = progress(taskid3)
    t1 = x1['result']['finished']
    t2 = x2['result']['finished']
    t3 = x3['result']['finished']
    print("正在作图中......")
    while t1 == False or t2 == False or t3 == False:
        time.sleep(1)
        x1 = progress(taskid1)
        time.sleep(1)
        x2 = progress(taskid2)
        time.sleep(1)
        x3 = progress(taskid3)
        t1 = x1['result']['finished']
        t2 = x2['result']['finished']
        t3 = x3['result']['finished']
        print("......")
    url1 = x1['result']['images_url'][0]
    url2 = x2['result']['images_url'][0]
    url3 = x3['result']['images_url'][0]
    response1 = requests.get(url1)
    response2 = requests.get(url2)
    response3 = requests.get(url3)
    url = {url1, url2, url3}
    my_list = list(url)
    return my_list

@app.route('/getkeyword', methods=['GET'])
def getkeyword():
    keyword=chat.keyword(pro3)
    return keyword

@app.route('/modifykeyword', methods=['POST'])
def modifykeyword():
    height = "576"
    width = "768"
    data = request.json
    print(data)
    req=data.get('requirements')
    pro = chat.modify(req)
    global pro1, pro2, pro3
    pro1 = chat.transform_1(pro)
    pro2 = chat.transform_2(pro)
    pro3 = chat.transform_3(pro)
    taskid1 = submit(pro1, height, width)
    taskid2 = submit(pro2, height, width)
    taskid3 = submit(pro3, height, width)
    x1 = progress(taskid1)
    x2 = progress(taskid2)
    x3 = progress(taskid3)
    t1 = x1['result']['finished']
    t2 = x2['result']['finished']
    t3 = x3['result']['finished']
    print("正在作图中......")
    while t1 == False or t2 == False or t3 == False:
        time.sleep(1)
        x1 = progress(taskid1)
        time.sleep(1)
        x2 = progress(taskid2)
        time.sleep(1)
        x3 = progress(taskid3)
        t1 = x1['result']['finished']
        t2 = x2['result']['finished']
        t3 = x3['result']['finished']
        print("......")
    url1 = x1['result']['images_url'][0]
    url2 = x2['result']['images_url'][0]
    url3 = x3['result']['images_url'][0]
    response1 = requests.get(url1)
    response2 = requests.get(url2)
    response3 = requests.get(url3)
    url = {url1, url2, url3}
    my_list = list(url)
    return tuple(my_list)

edupro=''
@app.route('/edu_paint', methods=['POST'])
def edu_paint():
    data = request.json
    print(data)
    pro = data.get('prompt')
    height = "576"
    width = "768"
    global edupro
    edupro = chat.edu(pro)
    taskid = submit(edupro, height, width)
    x = progress(taskid)
    t = x['result']['finished']
    print("正在作图中......")
    while t == False:
        time.sleep(1)
        progress(taskid)
        x = progress(taskid)
        t = x['result']['finished']
        print("......")
    x = progress(taskid)
    url = x['result']['images_url'][0]
    print(url)
    return url

@app.route('/edu_pro', methods=['GET'])
def edu_pro():
    global edupro
    r=edupro
    edupro=''
    return r



if __name__ == '__main__':
    app.run(debug=True)





