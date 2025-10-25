document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("hero-dynamic-container");
  const leftArrow = document.querySelector(".hero-dynamic-arrow.left");
  const rightArrow = document.querySelector(".hero-dynamic-arrow.right");

  const images = container.querySelectorAll("img");
  let index = 0;

  // Total number of images
  const totalImages = images.length;

  // Function to update the slide
  function updateSlide() {
    container.style.transform = `translateX(-${index * 100}%)`;
  }

  // Next image
  rightArrow.addEventListener("click", () => {
    index = (index + 1) % totalImages; // loop back to first
    updateSlide();
  });

  // Previous image
  leftArrow.addEventListener("click", () => {
    index = (index - 1 + totalImages) % totalImages; // loop to last
    updateSlide();
  });

  // Auto-slide every 4 seconds
  setInterval(() => {
    index = (index + 1) % totalImages;
    updateSlide();
  }, 4000);
});
