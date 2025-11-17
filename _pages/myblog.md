---
layout: myblog
title: My Blog
---

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Blog</title>
  <style>
    #feed {
      display: flex;
      flex-wrap: wrap;
      justify-content: center; /* 가로 간격을 균등하게 분배하여 정렬 */
      gap: 50px 30px; /* row-gap과 column-gap을 한 번에 설정 */
    }

    #feed > div {
      width: calc(50% - 100px);
    }

    @media screen and (max-width: 768px) {
      #feed > div {
         width: calc(90%); /* 화면이 작아질 때, 2개의 객체가 한 줄에 표시되도록 설정 */
      }
    }
  </style>
</head>
<body>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1">
<section class="section">
  <!-- velog feed api -->
  <div id="feed"></div>
  <script>
    fetch('https://velogfeed.vercel.app/api/feed?username=dksduddnr33&postnum=6')
      .then(res => res.json())
      .then(postinfoList => {
        const feedElement = document.getElementById('feed');
        postinfoList.forEach((postinfo) => {
          const svg = postinfo.svg;
          const url = postinfo.url;
          const cardHtml = `
            <div style="text-align: center;">
              <a href="${url}" target="_blank">${svg}</a>
            </div>
          `;
          feedElement.innerHTML += cardHtml;
        });
      })
      .catch(error => console.error(error));
  </script>
  <!-- velog feed api end -->
</section>

</body>
</html>
