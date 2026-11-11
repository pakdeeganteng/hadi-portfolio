"use strict";

window.portfolioMemoryPhotos = Array.from({ length: 90 }, (_, index) => {
  const number = String(index + 1).padStart(3, "0");
  return {
    id: `archive-${number}`,
    src: `assets/memories/photo-${number}.jpeg`,
    alt: `Foto kenangan pribadi nomor ${index + 1}`,
    caption: `Momen kenangan ${number}`,
    category: "Kenangan"
  };
});
