// 后端接口地址
const apiUrl = '/api/images';
// 图片数组
let generateWallpaperUrls = [];
let styletype='55c682d5eeca50d4806fd1cba3628781';
document.getElementById('inputImage1').style.backgroundImage=`url(${'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb463348573a4b5e798dde6952fda8944e-0.jpg'})`
document.getElementById('inputImage2').style.backgroundImage=`url(${'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbd4f73d91d7945211be431e01409c1d63-0.jpg'})`
document.getElementById('inputImage3').style.backgroundImage=`url(${'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbabf6d92832e25a5f847875cefcd72855-0.jpg'})`
function generateWallpaper() {
  const requirementInput = document.getElementById('requirementInput').value;
  console.log(requirementInput);
  const width = document.getElementById('widthSlider').value;
  const height = document.getElementById('heightSlider').value;
  const data = {
    'prompt': requirementInput,
  };
  const jsonData = JSON.stringify(data);
  fetch('http://127.0.0.1:5000/paint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonData
  })
  .then(response => {
    // 检查响应状态码是否为200-299
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // 解析JSON响应
    return response.json();
  })
  .then(data => {
    // 处理响应数据
    console.log(data.url1);
    console.log(data.url2);
    console.log(data.url3);

    // 使用这些URL来显示图像
    document.getElementById('inputImage1').style.backgroundImage=`url(${data.url1})`
    document.getElementById('inputImage2').style.backgroundImage=`url(${data.url2})`
    document.getElementById('inputImage3').style.backgroundImage=`url(${data.url3})`
  })
}
  function changeWidth() {
    const width = document.getElementById("widthSlider").value;
  }
  
  function changeHeight() {
    const height = document.getElementById("heightSlider").value;
  }
  const imageUrls = [
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbb7571993763956aa9106acac25be898a-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb3c3bd9137ca756a683247b8c2b3b96f4-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb87aa99277bcd535a9783491ce7618753-0.png',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbb8c1d8b94f7b54feb30a1c08e2f083ab-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb09a40145f0445971897c47b4ab4f9c5a-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb25b5704573325e2d990ae96cbb01cbae-0.png',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbb339d2c87e4859e8a6d1edcf224b5a9a-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb5a202114903b596488bdc2d21adb3dab-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbe3d3ab33571758fe81184ce5378cc58c-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbf05e9b765a18531783dec9c110acc487-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbe7f40e271567549298f778cb57079a27-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb935d9b95df265448ba7df67c11a2ad31-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbc5491bedbc025c0ba917ac6e784a5b97-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb49bb984b3bb25fe1939cf0d72d460ff0-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb3337adf00b215bf3898c26e967c6d10b-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb22f5a013c3625db680f5dcd2580181ca-0.png',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb956ea35a85355ec0862a7350d7a4eb13-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbfc62c603806b5e6b9df51ec53641a44a-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fb36010e42330e51db818ecc6a3f255e98-0.jpg',
    'https://ai-painting-image.vivo.com.cn/ai-painting/763783fbd636cd5660ab5e89a23bf9a37c78bdcc-0.jpg'
  ];
  
  let currentIndex = 0;
  
  function updateImages() {
    const imageElements = [
      document.getElementById('image1'),
      document.getElementById('image2'),
      document.getElementById('image3'),
      document.getElementById('image4')
    ];
  
    for (let i = 0; i < imageElements.length; i++) {
      const imgIndex = (currentIndex + i) % imageUrls.length;
      imageElements[i].style.backgroundImage = `url(${imageUrls[imgIndex]})`;
    }
  
    currentIndex = (currentIndex + 1) % imageUrls.length;
  }
  
  setInterval(updateImages, 3000);
  
  // 初始化图片
  updateImages();
  document.getElementById('generateButton').addEventListener('click', generateWallpaper);
  document.getElementById('style1').addEventListener('click', function() {
    styletype = '55c682d5eeca50d4806fd1cba3628781';
  });
  
  document.getElementById('style2').addEventListener('click', function() {
    styletype = '8fe3d641be3e589dad231dc6c3b1429a';
  });
  
  document.getElementById('style3').addEventListener('click', function() {
    styletype = '85ae2641576f5c409b273e0f490f15c0';
  });
  
  document.getElementById('style4').addEventListener('click', function() {
    styletype = '85062a504de85d719df43f268199c308';
  });
  
  document.getElementById('style5').addEventListener('click', function() {
    styletype = 'b3aacd62d38c5dbfb3f3491c00ba62f0';
  });
  
  document.getElementById('style6').addEventListener('click', function() {
    styletype = '897c280803be513fa947f914508f3134';
  });