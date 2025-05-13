/*
 * 图片懒加载功能
 * 使用方法:
 * 1. 引入JS: <script src="path/to/lazyImg.js"></script>
 * 2. 基本用法:
 *    <div>
 *      <img lazy-src="实际图片地址.jpg">
 *    </div>
 * 3. 添加占位符:
 *    - 使用页面元素: <img lazy-src="地址.jpg" lazy-placeholder="#加载元素ID">
 *    - 使用HTML字符串: <img lazy-src="地址.jpg" lazy-placeholder="<div>加载中...</div>">
 */

// 图片懒加载实现
(function () {
  // 检查浏览器是否支持IntersectionObserver
  const isIntersectionObserverSupported = "IntersectionObserver" in window;

  // 创建 IntersectionObserver 实例（如果支持）
  const observer = isIntersectionObserverSupported
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            loadImage(img);
            observer.unobserve(img);
          }
        });
      })
    : null;

  // 加载图片函数
  function loadImage(img) {
    const lazySrc = img.getAttribute("lazy-src");
    if (!lazySrc) return;

    // 设置父容器样式
    const parent = img.parentElement;
    if (parent) {
      parent.style.overflow = "hidden";
    }

    // 处理占位符
    const placeholder = img.getAttribute("lazy-placeholder");
    if (placeholder) {
      let placeholderElement;
      if (placeholder.startsWith("#")) {
        // 如果是ID选择器
        const placeholderDom = document.querySelector(placeholder);
        if (placeholderDom) {
          placeholderElement = placeholderDom.cloneNode(true);
          placeholderElement.style.display = "block";
        }
      } else {
        // 如果是HTML字符串
        const temp = document.createElement("div");
        temp.innerHTML = placeholder;
        placeholderElement = temp.firstElementChild;
      }

      if (placeholderElement) {
        placeholderElement.style.width = "100%";
        placeholderElement.style.height = "100%";
        img.style.display = "none";
        parent.insertBefore(placeholderElement, img);

        // 图片加载成功处理
        img.onload = function () {
          img.style.display = "";
          img.style.width = "100%";
          img.style.height = "100%";
          placeholderElement.style.display = "none";
          parent.removeChild(placeholderElement);

          // 清除懒加载相关属性
          img.removeAttribute("lazy-src");
          img.removeAttribute("lazy-placeholder");
        };
        img.src = lazySrc;
      }
    } else {
      // 没有占位符的情况
      img.src = lazySrc;
      img.style.width = "100%";
      img.style.height = "100%";
      img.removeAttribute("lazy-src");
      img.removeAttribute("lazy-placeholder");
    }
  }

  // 直接加载所有图片（用于不支持IntersectionObserver的浏览器）
  function loadAllImages() {
    const lazyImages = document.querySelectorAll("img[lazy-src]");
    lazyImages.forEach((img) => {
      loadImage(img);
    });
  }

  // 初始化函数
  function init() {
    if (isIntersectionObserverSupported) {
      // 支持IntersectionObserver，使用懒加载
      const lazyImages = document.querySelectorAll("img[lazy-src]");
      lazyImages.forEach((img) => {
        observer.observe(img);
      });
    } else {
      // 不支持IntersectionObserver，直接加载所有图片
      loadAllImages();
    }
  }

  // 当DOM加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
