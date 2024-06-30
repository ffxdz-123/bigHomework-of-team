document.addEventListener('DOMContentLoaded', (event) => {
    const data = {
        dog_image: 'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb01ad3b8d732a5e179205ccbafd4728b3-0.jpg',
        pig_image: 'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbd1dc434ee906572e8e7a2c113801699a-0.jpg',
        cat_image: 'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbd9fdeceb1bf2515f93ee7d9e1ec6e1bc-0.jpg',
        flower_image: 'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb521d8e4200b9597aaf97a1c5673e8cb5-0.jpg',
        requirement: '',
        res_pic: 'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb004706ed8741545d9ce213d23f413e17-0.jpg',
        res_story: '我会在这里为你讲述ta的故事',
    };

    window.handleInput = () => {
        const requirementInput = document.getElementById('requirement').value;
        data.requirement = requirementInput;
        // 这里调用后端代码，生成图片与文本

        // 模拟生成结果
        data.res_pic = data.dog_image; // 仅作为示例
        data.res_story = data.requirement; // 仅作为示例
        document.getElementById('res_pic').src = data.res_pic;
        document.getElementById('res_story').innerText = data.res_story;
    };

    generate: function() {
        const width = this.data.width;  
        const height = this.data.height;  
        const requirement = this.data.requirement;  
        const styletype=this.data.styletype;
        /* 调用后端代码，生成图片与文本 */
        // 假设请求成功并返回结果
        wx.showLoading({  
          title: '正在生成中',  
          mask: true // 显示透明蒙层，防止触摸穿透  
        }); 
        wx.request({  
          url: 'http:/127.0.0.1:5000/edu_paint',  
          method: 'POST',  
          data: {  
            'prompt': requirement,  
            'width': width,  
            'height': height, 
            'style':styletype,
          }, 
          success: res => {
            wx.showModal({  
              title: '生成成功',  
              content: '请查看图片和文字',  
              showCancel: true,
            });
            if (res.statusCode === 200) {  
              wx.hideLoading();
              console.log(res.data);
              wx.request({  
                url: 'http://127.0.0.1:5000/edu_pro',  
                method: 'GET', 
                success: (res) => {  
                  console.log(res.data)
                  this.setData({  
                    res_story: res.data, // 更新输入框的值  
                  });
                },  
                fail: (err) => {  
                  console.error('请求失败:', err);  
                }  
              });
              this.setData({  
                res_pic: res.data, // 更新输入框的值
              });
            } else {
              wx.showToast({  
                title: '生成失败，请重试',  
                icon: 'none'  
              }); 
            }  
          },
          fail: err => {  
            wx.showToast({  
              title: '网络请求失败，请重试',  
              icon: 'none'
            });  
          }  
        });  
      }
});
