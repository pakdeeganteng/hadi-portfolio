"use strict";

const portfolioConfig = {
  cvUrl: "",
  certificates: [
    {
      title: "HCIA-Datacom V1.0 Course",
      issuer: "Huawei ICT Academy",
      description: "Certificate of Completion",
      issuedAt: "2026-01-23",
      issuedLabel: "23 Januari 2026",
      image: "assets/certificates/hcia-datacom-v1.png",
      alt: "Sertifikat Huawei ICT Academy atas nama Abdul Hadi, HCIA-Datacom V1.0 Course"
    }
  ]
};

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section[id]")];
const siteHeader = document.querySelector(".site-header");
const floatingTop = document.querySelector(".floating-top");
const scrollProgress = document.querySelector(".scroll-progress");
const contactForm = document.querySelector("#contact-form");
const contactFormStatus = document.querySelector("#contact-form-status");
const certificateDialog = document.querySelector("#certificate-dialog");
const certificateGallery = document.querySelector("[data-certificate-gallery]");

if (certificateGallery instanceof HTMLElement) {
  certificateGallery.replaceChildren();
  portfolioConfig.certificates.forEach((certificate, index) => {
    const card = document.createElement("article");
    card.className = "certificate-card";

    const preview = document.createElement("button");
    preview.className = "certificate-preview";
    preview.type = "button";
    preview.dataset.certificateOpen = "";
    preview.dataset.certificateIndex = String(index);
    preview.setAttribute("aria-label", `Perbesar sertifikat ${certificate.title}`);

    const image = document.createElement("img");
    image.src = certificate.image;
    image.alt = certificate.alt;
    image.width = 768;
    image.height = 1056;
    image.loading = "lazy";
    image.decoding = "async";
    preview.append(image);

    const zoom = document.createElement("span");
    zoom.className = "certificate-zoom";
    zoom.setAttribute("aria-hidden", "true");
    zoom.textContent = "↗";
    preview.append(zoom);

    const details = document.createElement("div");
    details.className = "certificate-details";

    const issuer = document.createElement("p");
    issuer.className = "project-status";
    issuer.textContent = certificate.issuer;

    const title = document.createElement("h3");
    title.textContent = certificate.title;

    const description = document.createElement("p");
    description.textContent = certificate.description;

    const metadata = document.createElement("dl");
    const issuerMetadata = document.createElement("div");
    const issuerLabel = document.createElement("dt");
    issuerLabel.textContent = "Penerbit";
    const issuerValue = document.createElement("dd");
    issuerValue.textContent = certificate.issuer;
    issuerMetadata.append(issuerLabel, issuerValue);

    const dateMetadata = document.createElement("div");
    const dateLabel = document.createElement("dt");
    dateLabel.textContent = "Tanggal";
    const dateValue = document.createElement("dd");
    if (certificate.issuedAt) {
      const date = document.createElement("time");
      date.dateTime = certificate.issuedAt;
      date.textContent = certificate.issuedLabel;
      dateValue.append(date);
    } else {
      dateValue.textContent = certificate.issuedLabel || "Belum dicantumkan";
    }
    dateMetadata.append(dateLabel, dateValue);
    metadata.append(issuerMetadata, dateMetadata);

    const openLink = document.createElement("button");
    openLink.className = "text-link certificate-open-link";
    openLink.type = "button";
    openLink.dataset.certificateOpen = "";
    openLink.dataset.certificateIndex = String(index);
    openLink.append(document.createTextNode("Lihat sertifikat "));
    const openIcon = document.createElement("span");
    openIcon.setAttribute("aria-hidden", "true");
    openIcon.textContent = "↗";
    openLink.append(openIcon);

    details.append(issuer, title, description, metadata, openLink);
    card.append(preview, details);
    certificateGallery.append(card);
  });
}

const cvDownload = document.querySelector("[data-cv-download]");
if (cvDownload instanceof HTMLButtonElement && portfolioConfig.cvUrl) {
  cvDownload.disabled = false;
  cvDownload.removeAttribute("title");
  cvDownload.addEventListener("click", () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = portfolioConfig.cvUrl;
    downloadLink.download = "";
    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  });
}

const portalTrigger = document.querySelector("[data-portal-trigger]");
const portalDestination = document.querySelector("#proyek");
if (portalTrigger instanceof HTMLAnchorElement && portalDestination instanceof HTMLElement) {
  const portalMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  portalTrigger.addEventListener("pointermove", (event) => {
    if (portalMotion.matches || event.pointerType !== "mouse") {
      return;
    }

    const bounds = portalTrigger.getBoundingClientRect();
    const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
    const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
    portalTrigger.style.setProperty("--portal-pointer-x", `${offsetX.toFixed(1)}px`);
    portalTrigger.style.setProperty("--portal-pointer-y", `${offsetY.toFixed(1)}px`);
  });

  portalTrigger.addEventListener("pointerleave", () => {
    portalTrigger.style.removeProperty("--portal-pointer-x");
    portalTrigger.style.removeProperty("--portal-pointer-y");
  });

  portalTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    if (portalTrigger.classList.contains("is-warping")) {
      return;
    }

    const enterProjects = () => {
      window.history.pushState(null, "", "#proyek");
      portalDestination.scrollIntoView({ behavior: portalMotion.matches ? "auto" : "smooth", block: "start" });
      portalTrigger.classList.remove("is-warping");
    };

    if (portalMotion.matches) {
      enterProjects();
      return;
    }

    portalTrigger.classList.add("is-warping");
    window.setTimeout(enterProjects, 850);
  });
}

const skillFilters = [...document.querySelectorAll("[data-skill-filter]")];
const skillCards = [...document.querySelectorAll("[data-skill-category]")];
const skillFilterStatus = document.querySelector("[data-skill-filter-status]");
if (skillFilters.length && skillCards.length) {
  const filterTimers = new Map();
  let activeSkillFilter = "all";

  skillFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      const selectedCategory = filterButton.dataset.skillFilter;
      if (!selectedCategory) {
        return;
      }

      activeSkillFilter = selectedCategory;
      skillFilters.forEach((button) => {
        const isActive = button === filterButton;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      let visibleCount = 0;
      skillCards.forEach((card) => {
        window.clearTimeout(filterTimers.get(card));
        filterTimers.delete(card);
        const shouldShow = selectedCategory === "all" || card.dataset.skillCategory === selectedCategory;
        if (shouldShow) {
          visibleCount += 1;
          card.hidden = false;
          card.removeAttribute("aria-hidden");
          card.classList.add("is-filtering-out");
          window.requestAnimationFrame(() => {
            if (!card.hidden && (activeSkillFilter === "all" || card.dataset.skillCategory === activeSkillFilter)) {
              card.classList.remove("is-filtering-out");
            }
          });
          return;
        }

        card.setAttribute("aria-hidden", "true");
        card.classList.add("is-filtering-out");
        const timerId = window.setTimeout(() => {
          card.hidden = true;
          filterTimers.delete(card);
        }, 280);
        filterTimers.set(card, timerId);
      });

      if (skillFilterStatus) {
        skillFilterStatus.textContent = `${visibleCount} ${visibleCount === 1 ? "skill" : "skills"} shown.`;
      }
    });
  });
}

const memoryGrid = document.querySelector("[data-memory-grid]");
const memoryFilters = document.querySelector("[data-memory-filters]");
const memoryUpload = document.querySelector("[data-memory-upload]");
const memoryCategory = document.querySelector("[data-memory-upload-category]");
const memoryCaption = document.querySelector("[data-memory-upload-caption]");
const memoryStatus = document.querySelector("[data-memory-status]");
const memoryDialog = document.querySelector("#memory-dialog");
const memoryDialogTitle = document.querySelector("[data-memory-dialog-title]");
const memoryDialogCategory = document.querySelector("[data-memory-dialog-category]");
const memoryDialogImage = document.querySelector("[data-memory-dialog-image]");
const memoryCounter = document.querySelector("[data-memory-counter]");
const memoryDeleteButton = document.querySelector("[data-memory-delete]");
const memorySeedPhotos = Array.isArray(window.portfolioMemoryPhotos) ? window.portfolioMemoryPhotos : [];

if (memoryGrid instanceof HTMLElement && memoryFilters instanceof HTMLElement) {
  const allowedMemoryTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
  const memoryGlowColors = ["#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#ec4899"];
  const memoryObjectUrls = new Map();
  const tumbleBodies = new Map();
  const memoryMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const memoryPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let memoryItems = memorySeedPhotos.map((photo) => ({ ...photo, source: "archive" }));
  let selectedMemoryCategory = "all";
  let activeMemoryId = null;
  let memoryDatabasePromise = null;
  let memoryDialogTimer = 0;
  let tumbleFrame = 0;
  let tumbleLastFrame = 0;
  let tumbleWallStarted = false;
  let activeTumbleDrag = null;
  let activeMemoryLayout = "rings";
  let tumbleKnownWidth = memoryGrid.clientWidth;
  if (memoryUpload instanceof HTMLInputElement) {
    memoryUpload.disabled = true;
    document.querySelector(".memory-upload-button")?.classList.add("is-disabled");
  }

  const reportMemoryStatus = (message) => {
    if (memoryStatus) {
      memoryStatus.textContent = message;
    }
  };

  const getMemoryDatabase = () => {
    if (!("indexedDB" in window)) {
      return Promise.reject(new Error("Penyimpanan lokal browser tidak tersedia."));
    }
    if (memoryDatabasePromise) {
      return memoryDatabasePromise;
    }

    memoryDatabasePromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open("abdul-hadi-memories", 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains("photos")) {
          database.createObjectStore("photos", { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error("Database foto tidak dapat dibuka."));
      request.onblocked = () => reject(new Error("Penyimpanan foto sedang diblokir oleh tab lain."));
    });
    return memoryDatabasePromise;
  };

  const loadSavedMemories = async () => {
    try {
      const database = await getMemoryDatabase();
      const photos = await new Promise((resolve, reject) => {
        const transaction = database.transaction("photos", "readonly");
        const request = transaction.objectStore("photos").getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("Foto tersimpan gagal dibaca."));
      });

      photos.sort((first, second) => first.createdAt - second.createdAt);
      photos.forEach((photo) => {
        const src = URL.createObjectURL(photo.blob);
        memoryObjectUrls.set(photo.id, src);
        memoryItems.push({ ...photo, src, alt: photo.alt || photo.caption, source: "upload" });
      });
      renderMemoryGallery();
      reportMemoryStatus(`${memoryItems.length} foto ditampilkan. Foto unggahan hanya tersimpan di browser ini.`);
      if (memoryUpload instanceof HTMLInputElement) {
        memoryUpload.disabled = false;
      }
      document.querySelector(".memory-upload-button")?.classList.remove("is-disabled");
    } catch (error) {
      if (memoryUpload instanceof HTMLInputElement) {
        memoryUpload.disabled = true;
      }
      document.querySelector(".memory-upload-button")?.classList.add("is-disabled");
      reportMemoryStatus(`Foto bawaan tetap tersedia, tetapi penyimpanan unggahan tidak dapat dibuka: ${error.message}`);
    }
  };

  const getFilteredMemories = () => memoryItems.filter((item) =>
    selectedMemoryCategory === "all" || item.category === selectedMemoryCategory
  );

  const createFilterButton = (label, category, isActive) => {
    const button = document.createElement("button");
    button.className = `memory-filter${isActive ? " is-active" : ""}`;
    button.type = "button";
    button.dataset.memoryFilter = category;
    button.setAttribute("aria-pressed", String(isActive));
    button.textContent = label;
    return button;
  };

  const renderMemoryFilters = () => {
    const categories = [...new Set(memoryItems.map((item) => item.category).filter(Boolean))];
    if (selectedMemoryCategory !== "all" && !categories.includes(selectedMemoryCategory)) {
      selectedMemoryCategory = "all";
    }
    memoryFilters.replaceChildren(createFilterButton("Semua", "all", selectedMemoryCategory === "all"));
    categories.forEach((category) => {
      memoryFilters.append(createFilterButton(category, category, selectedMemoryCategory === category));
    });
  };

  const getTumbleWallSize = () => ({
    width: memoryGrid.clientWidth,
    height: memoryGrid.clientHeight
  });

  const getMemoryCardDimensions = (index, wallWidth) => {
    const compact = window.innerWidth <= 720;
    const baseWidth = window.innerWidth <= 480 ? 76 : compact ? 86 : 104;
    const width = Math.min(Math.max(72, baseWidth + (index % 4) * (compact ? 5 : 7)), Math.max(72, wallWidth - 8));
    const aspect = [0.76, 0.88, 0.68, 0.82, 0.94][index % 5];
    return { width, height: Math.round(width * aspect) + 18 };
  };

  const getTumbleRandom = (index, salt) => {
    const value = Math.sin((index + 1) * 127.1 + (salt + 1) * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };

  const renderTumbleBody = (body) => {
    body.card.style.setProperty("--memory-x", `${body.x.toFixed(1)}px`);
    body.card.style.setProperty("--memory-y", `${body.y.toFixed(1)}px`);
    body.card.style.setProperty("--memory-rotation", `${body.angle.toFixed(2)}deg`);
    body.card.style.setProperty("--memory-scale", String(body.scale ?? 1));
  };

  const getVisibleTumbleBodies = () => [...tumbleBodies.values()].filter((body) => body.active && !body.card.hidden);

  const prepareTumbleLayout = (bodies) => {
    const { width } = getTumbleWallSize();
    const compact = window.innerWidth <= 720;
    const height = Math.max(compact ? 760 : 820, width * (compact ? 1.75 : 0.92));
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.max(20, Math.min(width / 2 - 54, height / 2 - 72, compact ? 180 : 420));
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const ringCount = Math.max(1, Math.ceil(Math.sqrt(bodies.length / 4)));
    const ringMembers = Array.from({ length: ringCount }, () => []);
    const ringWeightTotal = (ringCount * (ringCount + 1)) / 2;
    const ringLimits = [];
    let ringLimit = 0;
    for (let ringIndex = 0; ringIndex < ringCount; ringIndex += 1) {
      ringLimit += Math.round((bodies.length * (ringIndex + 1)) / ringWeightTotal);
      ringLimits.push(ringLimit);
    }
    ringLimits[ringCount - 1] = bodies.length;
    bodies.forEach((_, index) => {
      const ringIndex = ringLimits.findIndex((limit) => index < limit);
      ringMembers[ringIndex].push(index);
    });
    const ringPositions = new Map();
    ringMembers.forEach((members, ringIndex) => {
      members.forEach((bodyIndex, position) => {
        ringPositions.set(bodyIndex, { ringIndex, position, count: members.length });
      });
    });
    memoryGrid.style.height = `${height}px`;

    bodies.forEach((body, index) => {
      const { width: cardWidth, height: cardHeight } = getMemoryCardDimensions(index, width);
      const progress = (index + 0.5) / Math.max(1, bodies.length);
      const angle = index * goldenAngle;
      let normalizedX = 0;
      let normalizedY = 0;
      let depth = 0;
      let ringScale = 1;
      body.orbiting = false;

      if (activeMemoryLayout === "rings") {
        const ring = ringPositions.get(index);
        const ringAngle = (ring.position / ring.count) * Math.PI * 2 + ring.ringIndex * 0.18;
        const orbitSpan = Math.min(maxRadius, width * 0.36);
        const radius = 72 + ring.ringIndex * ((orbitSpan - 72) / Math.max(1, ringCount - 1));
        normalizedX = Math.cos(ringAngle) * (radius / maxRadius);
        normalizedY = Math.sin(ringAngle) * (radius / maxRadius);
        depth = Math.sin(ringAngle);
        body.orbitCenterX = centerX;
        body.orbitCenterY = centerY;
        body.orbitRadius = radius;
        body.orbitAngle = ringAngle;
        body.orbitSpeed = (0.13 + ring.ringIndex * 0.025) * (ring.ringIndex % 2 === 0 ? 1 : -1);
        body.orbiting = true;
        if (ring.count > 1) {
          const spacing = 2 * radius * Math.sin(Math.PI / ring.count);
          ringScale = Math.min(1, (spacing * 0.82) / Math.max(cardWidth, 1));
        }
      } else if (activeMemoryLayout === "spiral") {
        const radius = 0.08 + progress * 0.92;
        const spiralAngle = index * 0.62;
        normalizedX = Math.cos(spiralAngle) * radius;
        normalizedY = Math.sin(spiralAngle) * radius;
        depth = Math.sin(spiralAngle);
      } else {
        const sphereY = 1 - progress * 2;
        const sphereRadius = Math.sqrt(Math.max(0, 1 - sphereY * sphereY));
        normalizedX = Math.cos(angle) * sphereRadius;
        normalizedY = sphereY * 0.82 + Math.sin(angle) * sphereRadius * 0.42;
        depth = Math.sin(angle) * sphereRadius;
      }

      body.width = cardWidth;
      body.height = cardHeight;
      body.card.style.width = `${cardWidth}px`;
      body.card.style.height = `${cardHeight}px`;
      const depthScale = activeMemoryLayout === "globe"
        ? 0.78 + ((depth + 1) / 2) * 0.22
        : activeMemoryLayout === "rings" ? ringScale : 1;
      body.scale = depthScale;
      body.targetX = Math.min(Math.max(0, centerX + normalizedX * maxRadius - cardWidth / 2), Math.max(0, width - cardWidth));
      body.targetY = Math.min(Math.max(0, centerY + normalizedY * maxRadius - cardHeight / 2), Math.max(0, height - cardHeight));
      body.card.style.zIndex = String(Math.round((depth + 1) * 1000) + index);
      body.card.style.opacity = activeMemoryLayout === "globe" ? String(0.62 + ((depth + 1) / 2) * 0.38) : "";
      body.card.style.setProperty("--memory-float-delay", `${-getTumbleRandom(index, 11) * 6}s`);
      body.card.style.setProperty("--memory-scale", String(depthScale));
      body.card.classList.add("is-constellation");
    });

    memoryGrid.dataset.layout = activeMemoryLayout;
  };

  const arrangeReducedMotionWall = () => {
    cancelAnimationFrame(tumbleFrame);
    tumbleFrame = 0;
    tumbleWallStarted = true;
    const bodies = getVisibleTumbleBodies();
    prepareTumbleLayout(bodies);
    bodies.forEach((body, index) => {
      body.width = Number.parseFloat(body.card.style.width);
      body.height = Number.parseFloat(body.card.style.height);
      body.card.querySelector("[data-memory-open]").tabIndex = 0;
      body.x = body.targetX;
      body.y = body.targetY;
      body.targetX = body.x;
      body.targetY = body.y;
      body.vx = 0;
      body.vy = 0;
      body.orbiting = false;
      body.angle = 0;
      body.delay = 0;
      body.settled = true;
      body.freeMotion = false;
      body.hasEntered = true;
      body.card.classList.add("is-constellation-settled");
      renderTumbleBody(body);
    });
  };

  const resetTumbleWall = () => {
    if (memoryMotion.matches) {
      arrangeReducedMotionWall();
      return;
    }

    const bodies = getVisibleTumbleBodies();
    prepareTumbleLayout(bodies);
    bodies.forEach((body, index) => {
      body.x = body.targetX;
      body.y = -body.height - 24 - (index % 9) * 42;
      body.vx = (getTumbleRandom(index, 2) - 0.5) * 100;
      body.vy = 0;
      body.angle = (getTumbleRandom(index, 3) - 0.5) * 24;
      body.angularVelocity = (getTumbleRandom(index, 4) - 0.5) * 36;
      body.delay = index * 18;
      body.active = true;
      body.hasEntered = false;
      body.settled = false;
      body.freeMotion = false;
      body.bounces = 0;
      body.orbiting = false;
      body.card.classList.remove("is-constellation-settled");
      body.card.querySelector("[data-memory-open]").tabIndex = -1;
      body.card.classList.remove("is-dragging");
      renderTumbleBody(body);
    });
    tumbleWallStarted = true;
    startTumblePhysics();
  };

  const transitionMemoryLayout = () => {
    const bodies = getVisibleTumbleBodies();
    cancelAnimationFrame(tumbleFrame);
    tumbleFrame = 0;
    tumbleLastFrame = 0;
    prepareTumbleLayout(bodies);

    bodies.forEach((body) => {
      window.clearTimeout(body.layoutTransitionTimer);
      body.card.classList.add("is-rearranging", "is-constellation-settled");
      body.x = body.targetX;
      body.y = body.targetY;
      body.vx = 0;
      body.vy = 0;
      body.angle = 0;
      body.angularVelocity = 0;
      body.delay = 0;
      body.settled = true;
      body.freeMotion = false;
      body.orbiting = activeMemoryLayout === "rings";
      body.card.querySelector("[data-memory-open]").tabIndex = 0;
      renderTumbleBody(body);
      body.layoutTransitionTimer = window.setTimeout(() => {
        body.card.classList.remove("is-rearranging");
      }, 900);
    });
    tumbleWallStarted = true;
    startTumblePhysics();
  };

  const animateTumbleWall = (timestamp) => {
    tumbleFrame = 0;
    if (document.hidden || memoryMotion.matches) {
      return;
    }
    const deltaTime = Math.min((timestamp - (tumbleLastFrame || timestamp)) / 1000, 0.025);
    tumbleLastFrame = timestamp;
    const { width, height } = getTumbleWallSize();
    const bodies = getVisibleTumbleBodies();

    bodies.forEach((body) => {
      if (body.dragging) {
        return;
      }
      if (body.orbiting && body.settled) {
        body.orbitAngle += body.orbitSpeed * deltaTime;
        body.x = body.orbitCenterX + Math.cos(body.orbitAngle) * body.orbitRadius - body.width / 2;
        body.y = body.orbitCenterY + Math.sin(body.orbitAngle) * body.orbitRadius - body.height / 2;
        body.angle = Math.sin(body.orbitAngle) * 2;
        return;
      }
      if (body.settled) {
        return;
      }
      if (body.delay > 0) {
        body.delay -= deltaTime * 1000;
        return;
      }

      body.vy += 1350 * deltaTime;
      body.x += body.vx * deltaTime;
      body.y += body.vy * deltaTime;
      body.angle += body.angularVelocity * deltaTime;
      body.angularVelocity *= 0.99;
      body.vx *= body.freeMotion ? 0.992 : 0.965;
      if (body.x < 0) {
        body.x = 0;
        body.vx = Math.abs(body.vx) * 0.42;
      } else if (body.x + body.width > width) {
        body.x = Math.max(0, width - body.width);
        body.vx = -Math.abs(body.vx) * 0.42;
      }
      if (body.y >= 0 && !body.hasEntered) {
        body.hasEntered = true;
        body.card.querySelector("[data-memory-open]").tabIndex = 0;
      }
      if (body.hasEntered && body.y < 0) {
        body.y = 0;
        body.vy = 0;
      }
      if (body.freeMotion) {
        if (body.y + body.height > height) {
          body.y = height - body.height;
          if (body.bounces === 0 && body.vy > 65) {
            body.vy = -body.vy * 0.2;
            body.bounces += 1;
            body.vx *= 0.72;
          } else {
            body.vy = 0;
            body.vx = 0;
            body.angularVelocity = 0;
            body.settled = true;
            body.orbiting = activeMemoryLayout === "rings";
            if (body.orbiting) {
              body.orbitAngle = Math.atan2(body.y + body.height / 2 - body.orbitCenterY, body.x + body.width / 2 - body.orbitCenterX);
            }
          }
        }
      } else if (body.y >= body.targetY) {
        body.y = body.targetY;
        if (body.bounces === 0 && body.vy > 70) {
          body.vy = -body.vy * 0.18;
          body.bounces += 1;
        } else {
          body.vy = 0;
          body.vx = 0;
          body.x = body.targetX;
          body.angularVelocity = 0;
          body.settled = true;
          body.orbiting = activeMemoryLayout === "rings";
          body.card.classList.add("is-constellation-settled");
        }
      }
    });

    bodies.forEach(renderTumbleBody);
    const activeMotion = bodies.some((body) => body.dragging || body.orbiting || (!body.settled && body.delay <= 0) || body.delay > 0);
    if (activeMotion) {
      tumbleFrame = requestAnimationFrame(animateTumbleWall);
    } else {
      tumbleLastFrame = 0;
    }
  };

  function startTumblePhysics() {
    if (!memoryMotion.matches && !document.hidden && !tumbleFrame) {
      tumbleFrame = requestAnimationFrame(animateTumbleWall);
    }
  }

  const createMemoryCard = (item, index) => {
    const card = document.createElement("article");
    card.className = "memory-card";
    card.dataset.memoryId = item.id;
    card.setAttribute("role", "listitem");
    card.style.setProperty("--memory-glow", memoryGlowColors[index % memoryGlowColors.length]);

    const button = document.createElement("button");
    button.className = "memory-image-button";
    button.type = "button";
    button.tabIndex = -1;
    button.dataset.memoryOpen = item.id;
    button.setAttribute("aria-label", `Buka foto: ${item.caption}`);

    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.alt;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      card.classList.add("memory-image-error");
      reportMemoryStatus(`Foto ${item.caption} tidak dapat dimuat. Periksa file foto di assets/memories.`);
    }, { once: true });

    const caption = document.createElement("span");
    caption.className = "memory-image-caption";
    const title = document.createElement("strong");
    title.textContent = item.caption;
    const category = document.createElement("small");
    category.textContent = item.category;
    caption.append(title, category);
    button.append(image, caption);
    card.append(button);
    return card;
  };

  function renderMemoryGallery() {
    renderMemoryFilters();
    tumbleBodies.clear();
    memoryGrid.style.height = "";
    memoryGrid.replaceChildren();

    const fragment = document.createDocumentFragment();
    memoryItems.forEach((item, index) => {
      const card = createMemoryCard(item, index);
      if (selectedMemoryCategory !== "all" && item.category !== selectedMemoryCategory) {
        card.hidden = true;
      }
      fragment.append(card);
      tumbleBodies.set(item.id, {
        item,
        card,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        angle: 0,
        angularVelocity: 0,
        delay: 0,
        hasEntered: false,
        targetX: 0,
        targetY: 0,
        scale: 1,
        settled: false,
        freeMotion: false,
        bounces: 0,
        active: !card.hidden,
        dragging: false,
        wasDragged: false,
        layoutTransitionTimer: 0
      });
    });
    memoryGrid.append(fragment);
    tumbleBodies.forEach((body, index) => {
      const { width, height } = getMemoryCardDimensions(index, memoryGrid.clientWidth);
      body.width = width;
      body.height = height;
      body.card.style.width = `${width}px`;
      body.card.style.height = `${height}px`;
      body.card.style.opacity = "";
      body.card.style.scale = "";
    });
    if (memoryMotion.matches) {
      arrangeReducedMotionWall();
    } else if (tumbleWallStarted) {
      resetTumbleWall();
    } else {
      const bodies = getVisibleTumbleBodies();
      prepareTumbleLayout(bodies);
      bodies.forEach((body, index) => {
        body.x = body.targetX;
        body.y = -body.height - 24 - (index % 9) * 42;
        body.delay = index * 18;
        body.settled = false;
        body.freeMotion = false;
        body.bounces = 0;
        body.card.querySelector("[data-memory-open]").tabIndex = -1;
        renderTumbleBody(body);
      });
    }
  }

  const updateMemoryDialog = (item) => {
    if (!item || !(memoryDialogImage instanceof HTMLImageElement)) {
      return;
    }
    activeMemoryId = item.id;
    if (memoryDialog instanceof HTMLDialogElement) {
      memoryDialog.querySelector(".memory-dialog-stage")?.classList.add("is-changing");
    }
    window.clearTimeout(memoryDialogTimer);
    memoryDialogTimer = window.setTimeout(() => {
      memoryDialogImage.src = item.src;
      memoryDialogImage.alt = item.alt;
      if (memoryDialogTitle) {
        memoryDialogTitle.textContent = item.caption;
      }
      if (memoryDialogCategory) {
        memoryDialogCategory.textContent = item.category.toUpperCase();
      }
      if (memoryCounter) {
        const index = getFilteredMemories().findIndex((photo) => photo.id === item.id);
        memoryCounter.textContent = `${index + 1} / ${getFilteredMemories().length}`;
      }
      if (memoryDeleteButton instanceof HTMLButtonElement) {
        memoryDeleteButton.hidden = item.source !== "upload";
      }
      memoryDialog?.querySelector(".memory-dialog-stage")?.classList.remove("is-changing");
    }, 100);
  };

  const showAdjacentMemory = (direction) => {
    const items = getFilteredMemories();
    const index = items.findIndex((item) => item.id === activeMemoryId);
    if (!items.length || index < 0) {
      return;
    }
    updateMemoryDialog(items[(index + direction + items.length) % items.length]);
  };

  memoryFilters.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const button = event.target.closest("[data-memory-filter]");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    selectedMemoryCategory = button.dataset.memoryFilter || "all";
    renderMemoryFilters();
    tumbleBodies.forEach((body) => {
      body.active = selectedMemoryCategory === "all" || body.item.category === selectedMemoryCategory;
      body.card.hidden = !body.active;
    });
    if (memoryMotion.matches) {
      arrangeReducedMotionWall();
    } else {
      resetTumbleWall();
    }
    reportMemoryStatus(`${getFilteredMemories().length} foto ditampilkan pada kategori ${selectedMemoryCategory === "all" ? "Semua" : selectedMemoryCategory}.`);
  });

  document.querySelectorAll("[data-memory-layout]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!(button instanceof HTMLButtonElement)) {
        return;
      }
      activeMemoryLayout = button.dataset.memoryLayout || "rings";
      document.querySelectorAll("[data-memory-layout]").forEach((layoutButton) => {
        const selected = layoutButton === button;
        layoutButton.classList.toggle("is-active", selected);
        layoutButton.setAttribute("aria-pressed", String(selected));
      });
      if (tumbleWallStarted) {
        if (memoryMotion.matches) {
          arrangeReducedMotionWall();
        } else {
          transitionMemoryLayout();
        }
      } else if (memoryMotion.matches) {
        arrangeReducedMotionWall();
      } else {
        prepareTumbleLayout(getVisibleTumbleBodies());
      }
      const layoutLabel = activeMemoryLayout === "rings" ? "Ring" : activeMemoryLayout === "spiral" ? "Spiral" : "Globe";
      reportMemoryStatus(`Susunan galeri diubah ke ${layoutLabel}.`);
    });
  });

  document.querySelector("[data-tumble-reset]")?.addEventListener("click", () => {
    resetTumbleWall();
    reportMemoryStatus(`Foto disusun ulang dalam pola ${activeMemoryLayout}.`);
  });

  memoryGrid.addEventListener("pointerdown", (event) => {
    if ((!memoryPointer.matches && event.pointerType !== "touch") || memoryMotion.matches || !(event.target instanceof Element)) {
      return;
    }
    const button = event.target.closest("[data-memory-open]");
    const card = button?.closest(".memory-card");
    const body = card instanceof HTMLElement ? tumbleBodies.get(card.dataset.memoryId) : null;
    if (!(button instanceof HTMLButtonElement) || !body) {
      return;
    }
    const wallRect = memoryGrid.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    activeTumbleDrag = {
      body,
      pointerId: event.pointerId,
      offsetX: event.clientX - cardRect.left,
      offsetY: event.clientY - cardRect.top,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: performance.now(),
      velocityX: 0,
      velocityY: 0,
      moved: false,
      touch: event.pointerType === "touch",
      wallLeft: wallRect.left,
      wallTop: wallRect.top
    };
    body.dragging = true;
    body.settled = false;
    body.vx = 0;
    body.vy = 0;
    body.card.classList.add("is-dragging");
    body.card.style.zIndex = "10";
    button.setPointerCapture(event.pointerId);
    startTumblePhysics();
  });

  memoryGrid.addEventListener("pointermove", (event) => {
    if (!activeTumbleDrag || event.pointerId !== activeTumbleDrag.pointerId) {
      return;
    }
    const drag = activeTumbleDrag;
    const body = drag.body;
    const { width } = getTumbleWallSize();
    const nextX = event.clientX - drag.wallLeft - drag.offsetX;
    const now = performance.now();
    const elapsed = Math.max(0.008, (now - drag.lastTime) / 1000);
    const deltaX = event.clientX - drag.lastX;
    const deltaY = event.clientY - drag.lastY;
    if (drag.touch && Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }
    const nextY = drag.touch ? body.y : event.clientY - drag.wallTop - drag.offsetY;
    drag.velocityX = deltaX / elapsed;
    drag.velocityY = deltaY / elapsed;
    drag.moved ||= Math.abs(nextX - body.x) + Math.abs(nextY - body.y) > 8;
    body.x = Math.min(Math.max(0, nextX), Math.max(0, width - body.width));
    body.y = Math.min(Math.max(0, nextY), memoryGrid.clientHeight - body.height);
    body.angle = Math.max(-28, Math.min(28, body.angle + deltaX * 0.12));
    body.angularVelocity = deltaX * 0.8;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.lastTime = now;
    renderTumbleBody(body);
  });

  const finishTumbleDrag = (event) => {
    if (!activeTumbleDrag || event.pointerId !== activeTumbleDrag.pointerId) {
      return;
    }
    const { body, moved, velocityX, velocityY } = activeTumbleDrag;
    body.dragging = false;
    body.wasDragged = moved;
    body.vx = Math.max(-1250, Math.min(1250, velocityX * 0.72));
    body.vy = Math.max(-1100, Math.min(1100, velocityY * 0.72));
    body.freeMotion = moved;
    body.settled = !moved;
    body.bounces = 0;
    body.card.classList.remove("is-dragging");
    body.card.classList.remove("is-constellation-settled");
    body.card.style.zIndex = "";
    activeTumbleDrag = null;
    startTumblePhysics();
  };
  memoryGrid.addEventListener("pointerup", finishTumbleDrag);
  memoryGrid.addEventListener("pointercancel", finishTumbleDrag);

  memoryGrid.addEventListener("keydown", (event) => {
    if (!(event.target instanceof HTMLButtonElement) || !event.target.matches("[data-memory-open]")) {
      return;
    }
    const body = tumbleBodies.get(event.target.dataset.memoryOpen);
    if (!body) {
      return;
    }
    const distance = event.shiftKey ? 48 : 24;
    const { width, height } = getTumbleWallSize();
    const positions = {
      ArrowLeft: [-distance, 0],
      ArrowRight: [distance, 0],
      ArrowUp: [0, -distance],
      ArrowDown: [0, distance]
    };
    const move = positions[event.key];
    if (!move) {
      return;
    }
    event.preventDefault();
    body.x = Math.min(Math.max(0, body.x + move[0]), Math.max(0, width - body.width));
    body.y = Math.min(Math.max(0, body.y + move[1]), Math.max(0, height - body.height));
    body.targetX = body.x;
    body.targetY = body.y;
    body.vx = 0;
    body.vy = 0;
    body.freeMotion = false;
    body.settled = true;
    body.card.classList.add("is-constellation-settled");
    renderTumbleBody(body);
  });

  memoryGrid.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || !(memoryDialog instanceof HTMLDialogElement)) {
      return;
    }
    const button = event.target.closest("[data-memory-open]");
    const item = button instanceof HTMLButtonElement
      ? getFilteredMemories().find((photo) => photo.id === button.dataset.memoryOpen)
      : null;
    if (!item) {
      return;
    }
    const body = tumbleBodies.get(item.id);
    if (body?.wasDragged) {
      body.wasDragged = false;
      event.preventDefault();
      return;
    }
    updateMemoryDialog(item);
    if (!memoryDialog.open) {
      memoryDialog.showModal();
    }
  });

  memoryDialog?.querySelector("[data-memory-close]")?.addEventListener("click", () => memoryDialog.close());
  memoryDialog?.querySelector("[data-memory-prev]")?.addEventListener("click", () => showAdjacentMemory(-1));
  memoryDialog?.querySelector("[data-memory-next]")?.addEventListener("click", () => showAdjacentMemory(1));
  memoryDialog?.addEventListener("click", (event) => {
    if (event.target === memoryDialog) {
      memoryDialog.close();
    }
  });
  memoryDialog?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showAdjacentMemory(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showAdjacentMemory(1);
    }
  });

  memoryDeleteButton?.addEventListener("click", async () => {
    const item = memoryItems.find((photo) => photo.id === activeMemoryId);
    if (!item || item.source !== "upload" || !window.confirm(`Hapus foto unggahan "${item.caption}" dari browser ini?`)) {
      return;
    }
    try {
      const database = await getMemoryDatabase();
      await new Promise((resolve, reject) => {
        const transaction = database.transaction("photos", "readwrite");
        transaction.objectStore("photos").delete(item.id);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error ?? new Error("Foto gagal dihapus."));
        transaction.onabort = () => reject(transaction.error ?? new Error("Penghapusan foto dibatalkan."));
      });
      URL.revokeObjectURL(memoryObjectUrls.get(item.id));
      memoryObjectUrls.delete(item.id);
      memoryItems = memoryItems.filter((photo) => photo.id !== item.id);
      memoryDialog.close();
      renderMemoryGallery();
      reportMemoryStatus(`Foto "${item.caption}" berhasil dihapus dari penyimpanan browser.`);
    } catch (error) {
      reportMemoryStatus(`Foto tidak dapat dihapus: ${error.message}`);
    }
  });

  memoryUpload?.addEventListener("change", async () => {
    const files = [...memoryUpload.files];
    memoryUpload.value = "";
    if (!files.length) {
      return;
    }
    if (files.length > 20) {
      reportMemoryStatus("Pilih maksimal 20 foto sekali unggah.");
      return;
    }
    const invalid = files.filter((file) => !allowedMemoryTypes.has(file.type) || file.size > 10 * 1024 * 1024);
    if (invalid.length) {
      reportMemoryStatus("Unggahan ditolak: gunakan JPG, PNG, atau WebP dengan ukuran maksimal 10 MB per foto.");
      return;
    }

    try {
      const database = await getMemoryDatabase();
      const category = memoryCategory instanceof HTMLSelectElement ? memoryCategory.value : "Kenangan";
      const caption = memoryCaption instanceof HTMLInputElement ? memoryCaption.value.trim() : "";
      for (const [index, file] of files.entries()) {
        const id = `upload-${window.crypto?.randomUUID?.() || `${Date.now()}-${index}`}`;
        const fallbackCaption = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
        const item = {
          id,
          caption: caption || fallbackCaption || "Foto unggahan",
          alt: caption || fallbackCaption || "Foto kenangan yang diunggah",
          category,
          createdAt: Date.now() + index,
          blob: file
        };
        await new Promise((resolve, reject) => {
          const transaction = database.transaction("photos", "readwrite");
          transaction.objectStore("photos").put(item);
          transaction.oncomplete = resolve;
          transaction.onerror = () => reject(transaction.error ?? new Error("Foto gagal disimpan."));
          transaction.onabort = () => reject(transaction.error ?? new Error("Penyimpanan foto dibatalkan."));
        });
        const src = URL.createObjectURL(file);
        memoryObjectUrls.set(id, src);
        memoryItems.push({ ...item, src, source: "upload" });
      }
      renderMemoryGallery();
      reportMemoryStatus(`${files.length} foto tersimpan di browser ini dengan kategori ${category}.`);
      memoryCaption.value = "";
    } catch (error) {
      reportMemoryStatus(`Foto tidak dapat disimpan: ${error.message}`);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(tumbleFrame);
      tumbleFrame = 0;
      tumbleLastFrame = 0;
    } else {
      startTumblePhysics();
    }
  });
  const tumbleWallObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
      if (!tumbleWallStarted && entries.some((entry) => entry.isIntersecting)) {
        resetTumbleWall();
      }
    }, { threshold: 0.02 })
    : null;
  tumbleWallObserver?.observe(memoryGrid);
  if (!tumbleWallObserver) {
    resetTumbleWall();
  }
  window.addEventListener("resize", () => {
    const { width } = getTumbleWallSize();
    if (Math.abs(width - tumbleKnownWidth) < 1) {
      return;
    }
    tumbleKnownWidth = width;
    if (memoryMotion.matches) {
      arrangeReducedMotionWall();
      return;
    }
    resetTumbleWall();
  }, { passive: true });
  memoryMotion.addEventListener?.("change", () => {
    if (memoryMotion.matches) {
      if (activeTumbleDrag) {
        activeTumbleDrag.body.dragging = false;
        activeTumbleDrag.body.card.classList.remove("is-dragging");
        activeTumbleDrag.body.card.style.zIndex = "";
        activeTumbleDrag = null;
      }
      cancelAnimationFrame(tumbleFrame);
      tumbleFrame = 0;
      arrangeReducedMotionWall();
    } else {
      memoryGrid.style.height = "";
      resetTumbleWall();
    }
  });

  renderMemoryGallery();
  loadSavedMemories();
}

const typewriter = document.querySelector("[data-typewriter]");
if (typewriter instanceof HTMLElement) {
  const typewriterText = typewriter.querySelector("[data-typewriter-text]");
  const accessibleRole = typewriter.querySelector("[data-typewriter-accessible]");
  const roleCount = typewriter.querySelector("[data-role-count]");
  const previousRole = typewriter.querySelector("[data-role-previous]");
  const nextRole = typewriter.querySelector("[data-role-next]");
  const roles = [
    "Mahasiswa Politeknik Negeri Padang",
    "Web Developer Enthusiast",
    "Creative Problem Solver",
    "Passionate About Web Development"
  ];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (
    typewriterText instanceof HTMLElement
    && accessibleRole instanceof HTMLElement
    && roleCount instanceof HTMLElement
    && previousRole instanceof HTMLButtonElement
    && nextRole instanceof HTMLButtonElement
  ) {
    let activeRole = 0;
    let characterIndex = 0;
    let timerId = 0;
    let paused = false;
    let deleting = false;

    const updateCount = () => {
      roleCount.textContent = `${String(activeRole + 1).padStart(2, "0")} / ${String(roles.length).padStart(2, "0")}`;
    };

    const scheduleTick = (delay) => {
      window.clearTimeout(timerId);
      if (!paused && !document.hidden && !reducedMotion.matches) {
        timerId = window.setTimeout(tick, delay);
      }
    };

    const showStaticRole = () => {
      characterIndex = roles[activeRole].length;
      deleting = true;
      typewriterText.textContent = roles[activeRole];
      accessibleRole.textContent = roles[activeRole];
    };

    const tick = () => {
      if (reducedMotion.matches) {
        showStaticRole();
        return;
      }

      const phrase = roles[activeRole];
      if (deleting) {
        characterIndex -= 1;
        typewriterText.textContent = phrase.slice(0, characterIndex);
        if (characterIndex === 0) {
          activeRole = (activeRole + 1) % roles.length;
          updateCount();
          deleting = false;
          scheduleTick(180);
          return;
        }
        scheduleTick(55);
        return;
      }

      characterIndex += 1;
      typewriterText.textContent = phrase.slice(0, characterIndex);
      if (characterIndex === phrase.length) {
        accessibleRole.textContent = phrase;
        deleting = true;
        scheduleTick(1750);
        return;
      }
      scheduleTick(90);
    };

    const changeRole = (step) => {
      window.clearTimeout(timerId);
      paused = false;
      activeRole = (activeRole + step + roles.length) % roles.length;
      characterIndex = 0;
      deleting = false;
      updateCount();
      typewriterText.textContent = "";
      if (reducedMotion.matches) {
        showStaticRole();
      } else {
        scheduleTick(80);
      }
    };

    const pause = () => {
      paused = true;
      window.clearTimeout(timerId);
    };

    const resume = () => {
      paused = false;
      if (reducedMotion.matches) {
        showStaticRole();
      } else {
        scheduleTick(250);
      }
    };

    previousRole.addEventListener("click", () => changeRole(-1));
    nextRole.addEventListener("click", () => changeRole(1));
    typewriter.addEventListener("pointerenter", pause);
    typewriter.addEventListener("pointerleave", resume);
    typewriter.addEventListener("focusin", pause);
    typewriter.addEventListener("focusout", (event) => {
      if (!(event.relatedTarget instanceof Node) || !typewriter.contains(event.relatedTarget)) {
        resume();
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.clearTimeout(timerId);
      } else {
        scheduleTick(500);
      }
    });
    reducedMotion.addEventListener("change", () => {
      window.clearTimeout(timerId);
      if (reducedMotion.matches) {
        showStaticRole();
      } else {
        characterIndex = 0;
        deleting = false;
        typewriterText.textContent = "";
        scheduleTick(500);
      }
    });

    updateCount();
    if (reducedMotion.matches) {
      showStaticRole();
    } else {
      typewriterText.textContent = "";
      scheduleTick(200);
    }
  }
}

const paragraphMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const activeParagraphTyping = new Map();

const typeParagraph = (paragraph) => {
  if (paragraphMotion.matches || paragraph.dataset.typingPlayed === "true") {
    return;
  }

  const originalNodes = [...paragraph.childNodes].map((node) => node.cloneNode(true));
  const visual = document.createElement("span");
  visual.className = "paragraph-typewriter-visual";
  visual.setAttribute("aria-hidden", "true");
  originalNodes.forEach((node) => visual.append(node.cloneNode(true)));

  const accessible = document.createElement("span");
  accessible.className = "visually-hidden";
  originalNodes.forEach((node) => accessible.append(node.cloneNode(true)));

  const textNodes = [];
  const walker = document.createTreeWalker(visual, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    textNodes.push({ node: textNode, characters: Array.from(textNode.textContent ?? "") });
    textNode.textContent = "";
  }
  if (textNodes.length === 0) {
    return;
  }

  paragraph.dataset.typingPlayed = "true";
  paragraph.dataset.typingActive = "true";
  paragraph.replaceChildren(visual, accessible);

  let nodeIndex = 0;
  let characterIndex = 0;
  let timerId = 0;
  const finish = () => {
    window.clearTimeout(timerId);
    activeParagraphTyping.delete(paragraph);
    paragraph.removeAttribute("data-typing-active");
    paragraph.replaceChildren(...originalNodes);
  };
  const typeNextCharacter = () => {
    if (paragraphMotion.matches) {
      finish();
      return;
    }

    while (nodeIndex < textNodes.length && characterIndex >= textNodes[nodeIndex].characters.length) {
      nodeIndex += 1;
      characterIndex = 0;
    }
    if (nodeIndex >= textNodes.length) {
      finish();
      return;
    }

    const currentText = textNodes[nodeIndex];
    currentText.node.textContent += currentText.characters[characterIndex];
    characterIndex += 1;
    timerId = window.setTimeout(typeNextCharacter, 28);
  };

  activeParagraphTyping.set(paragraph, finish);
  timerId = window.setTimeout(typeNextCharacter, 120);
};

paragraphMotion.addEventListener("change", (event) => {
  if (event.matches) {
    activeParagraphTyping.forEach((finish) => finish());
  }
});

const closeMobileNav = () => {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
};

if (menuToggle instanceof HTMLButtonElement && siteNav instanceof HTMLElement) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMobileNav();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      menuToggle.getAttribute("aria-expanded") === "true"
      && event.target instanceof Node
      && !siteNav.contains(event.target)
      && !menuToggle.contains(event.target)
    ) {
      closeMobileNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMobileNav();
      menuToggle.focus();
    }
  });
}

const updateScrollChrome = () => {
  const isScrolled = window.scrollY > 24;
  siteHeader?.classList.toggle("is-scrolled", isScrolled);
  floatingTop?.classList.toggle("is-visible", window.scrollY > 560);

  if (scrollProgress instanceof HTMLElement) {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
    scrollProgress.style.setProperty("--scroll-progress", String(progress));
  }
};

let scrollFrame = 0;
window.addEventListener("scroll", () => {
  if (!scrollFrame) {
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      updateScrollChrome();
    });
  }
}, { passive: true });
updateScrollChrome();

const ringFieldMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const ringFieldTargets = [...document.querySelectorAll(".hero, .content-section")];
if (ringFieldTargets.length) {
  const ringFields = ringFieldTargets.flatMap((section, sectionIndex) => {
    const canvas = document.createElement("canvas");
    canvas.className = "ring-field-canvas";
    canvas.setAttribute("aria-hidden", "true");
    section.prepend(canvas);

    const context = canvas.getContext("2d");
    if (!context) {
      canvas.remove();
      return [];
    }

    const accent = getComputedStyle(section).getPropertyValue("--accent").trim() || "#06b6d4";
    const particles = Array.from({ length: window.innerWidth < 720 ? 90 : 150 }, (_, index) => {
      const ring = index % 5;
      return {
        angle: Math.random() * Math.PI * 2,
        radius: 0.13 + ring * 0.16 + (Math.random() - 0.5) * 0.09,
        speed: 0.008 + Math.random() * 0.012,
        size: 0.45 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        wave: 2 + Math.random() * 7
      };
    });

    return [{
      canvas,
      context,
      accent,
      particles,
      sectionIndex,
      width: 0,
      height: 0,
      visible: false
    }];
  });

  let ringFrame = 0;
  let lastRingFrame = 0;

  const resizeRingFields = () => {
    ringFields.forEach((field) => {
      const bounds = field.canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      field.width = bounds.width;
      field.height = bounds.height;
      field.canvas.width = Math.round(bounds.width * ratio);
      field.canvas.height = Math.round(bounds.height * ratio);
      field.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    });
  };

  const drawRingFields = (timestamp = 0) => {
    const delta = lastRingFrame ? Math.min((timestamp - lastRingFrame) / 1000, 0.05) : 0;
    lastRingFrame = timestamp;

    ringFields.forEach((field) => {
      if (!field.visible && !ringFieldMotion.matches) {
        return;
      }

      const { context, width, height, accent, particles, sectionIndex } = field;
      if (!width || !height) {
        return;
      }

      const centerX = width * (sectionIndex === 0 ? 0.74 : 0.78);
      const centerY = height * 0.49;
      const maxRadius = Math.hypot(width * 0.48, height * 0.72);
      const time = timestamp / 1000;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";

      const core = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.62);
      core.addColorStop(0, "rgba(3, 6, 14, 0.68)");
      core.addColorStop(0.48, "rgba(3, 6, 14, 0.25)");
      core.addColorStop(1, "rgba(3, 6, 14, 0)");
      context.fillStyle = core;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      particles.forEach((particle) => {
        const radiusRatio = (particle.radius + time * particle.speed) % 1.02;
        const angle = particle.angle + Math.sin(time * 0.42 + particle.phase) * 0.025;
        const wave = Math.sin(angle * 5 + time * 0.75 + particle.phase) * particle.wave;
        const radius = radiusRatio * maxRadius + wave;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.53;
        const pulse = 0.5 + Math.sin(time * 1.15 + particle.phase) * 0.5;

        context.globalAlpha = 0.16 + pulse * 0.4;
        context.fillStyle = accent;
        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
    });

    ringFrame = 0;
    if (!ringFieldMotion.matches && !document.hidden && ringFields.some((field) => field.visible)) {
      ringFrame = window.requestAnimationFrame(drawRingFields);
    }
  };

  const scheduleRingFrame = () => {
    if (!ringFrame && !ringFieldMotion.matches && !document.hidden) {
      ringFrame = window.requestAnimationFrame(drawRingFields);
    } else if (ringFieldMotion.matches) {
      drawRingFields();
    }
  };

  resizeRingFields();
  if ("IntersectionObserver" in window) {
    const ringObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const field = ringFields.find((candidate) => candidate.canvas.parentElement === entry.target);
        if (field) {
          field.visible = entry.isIntersecting;
        }
      });
      scheduleRingFrame();
    }, { rootMargin: "100px 0px" });
    ringFields.forEach((field) => ringObserver.observe(field.canvas.parentElement));
  } else {
    ringFields.forEach((field) => {
      field.visible = true;
    });
    scheduleRingFrame();
  }

  window.addEventListener("resize", () => {
    resizeRingFields();
    scheduleRingFrame();
  }, { passive: true });
  document.addEventListener("visibilitychange", scheduleRingFrame);
  ringFieldMotion.addEventListener("change", () => {
    if (ringFieldMotion.matches && ringFrame) {
      window.cancelAnimationFrame(ringFrame);
      ringFrame = 0;
    }
    lastRingFrame = 0;
    scheduleRingFrame();
  });
}

const staggerMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const staggerTargetSelector =
  "h1, h2, .hero-kicker, .hero-greeting, .section-body > .eyebrow, .timeline-item h3, .skill-card h3, .project-info h3, .certificate-details h3, .contact-info-card strong, .bio-list dd, .education-facts dd";
const staggerObserver = !staggerMotion.matches && "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-stagger-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25, rootMargin: "0px 0px -6% 0px" })
  : null;

const prepareStaggerText = (root) => {
  if (staggerMotion.matches) {
    return;
  }

  const targets = root.querySelectorAll(staggerTargetSelector);
  targets.forEach((element) => {
    if (element.closest("[data-typewriter], .visually-hidden") || element.dataset.staggered === "true") {
      return;
    }

    const accessibleText = (element.innerText || element.textContent || "").replace(/\s+/g, " ").trim();
    if (!accessibleText.trim()) {
      return;
    }

    const visual = document.createElement("span");
    visual.className = "staggered-text-visual";
    visual.setAttribute("aria-hidden", "true");
    [...element.childNodes].forEach((node) => visual.append(node.cloneNode(true)));

    const letterMode = element.matches("h1, h2");
    const textNodes = [];
    const walker = document.createTreeWalker(visual, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    let staggerIndex = 0;
    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      const tokens = (textNode.textContent ?? "").split(/(\s+)/);
      tokens.forEach((token) => {
        if (!token || /^\s+$/.test(token)) {
          fragment.append(document.createTextNode(token));
          return;
        }

        const unit = document.createElement("span");
        if (letterMode) {
          unit.className = "staggered-word";
          Array.from(token).forEach((character) => {
            const letter = document.createElement("span");
            letter.className = "staggered-letter";
            letter.textContent = character;
            letter.style.setProperty("--stagger-delay", `${Math.min(staggerIndex * 24, 720)}ms`);
            staggerIndex += 1;
            unit.append(letter);
          });
        } else {
          unit.className = "staggered-word staggered-word-reveal";
          unit.style.setProperty("--stagger-delay", `${Math.min(staggerIndex * 48, 480)}ms`);
          staggerIndex += 1;
        }
        fragment.append(unit);
      });
      textNode.replaceWith(fragment);
    });

    const accessible = document.createElement("span");
    accessible.className = "visually-hidden staggered-text-accessible";
    accessible.textContent = accessibleText;
    element.replaceChildren(visual, accessible);
    element.dataset.staggered = "true";
    if (staggerObserver) {
      staggerObserver.observe(element);
    } else {
      element.classList.add("is-stagger-visible");
    }
  });
};

document.querySelectorAll(".reveal-panel").forEach(prepareStaggerText);

if ("IntersectionObserver" in window) {
  document.body.classList.add("reveal-enabled");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal-panel").forEach((panel) => revealObserver.observe(panel));

  const paragraphObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.querySelectorAll(
        "p:not(.eyebrow):not(.section-number):not(.project-status):not(.timeline-date):not(.timeline-program):not(.hero-greeting):not(.hero-location):not(.visually-hidden):not(.hero-profession-line):not(.form-status)"
      ).forEach(typeParagraph);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  sections.forEach((section) => paragraphObserver.observe(section));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-25% 0px -65% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
} else {
  document.querySelectorAll(".reveal-panel").forEach((panel) => {
    panel.classList.add("is-visible");
  });
}

if (certificateDialog instanceof HTMLDialogElement) {
  const certificateTitle = certificateDialog.querySelector("#certificate-dialog-title");
  const certificateImage = certificateDialog.querySelector("[data-certificate-dialog-image]");
  const closeButton = certificateDialog.querySelector("[data-certificate-close]");

  certificateGallery?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const openButton = event.target.closest("[data-certificate-open]");
    if (!(openButton instanceof HTMLButtonElement)) {
      return;
    }

    const index = Number(openButton.dataset.certificateIndex);
    const certificate = portfolioConfig.certificates[index];
    if (!certificate || !(certificateTitle instanceof HTMLElement) || !(certificateImage instanceof HTMLImageElement)) {
      return;
    }

    certificateTitle.textContent = certificate.title;
    certificateImage.src = certificate.image;
    certificateImage.alt = certificate.alt;
    certificateDialog.showModal();
  });

  closeButton?.addEventListener("click", () => certificateDialog.close());
  certificateDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      certificateDialog.close();
    }
  });
  certificateDialog.addEventListener("click", (event) => {
    if (event.target === certificateDialog) {
      certificateDialog.close();
    }
  });
}

const projectDialog = document.querySelector("#project-dialog");
if (projectDialog instanceof HTMLDialogElement) {
  const projectOpen = document.querySelector("[data-project-open]");
  const projectClose = projectDialog.querySelector("[data-project-close]");
  let projectCloseTimer;
  const finishProjectDialogClose = () => {
    if (projectDialog.open && projectDialog.classList.contains("is-closing")) {
      projectDialog.close();
      projectDialog.classList.remove("is-closing");
    }
  };
  const closeProjectDialog = () => {
    if (!projectDialog.open) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      projectDialog.close();
      return;
    }
    if (projectDialog.classList.contains("is-closing")) {
      return;
    }
    projectDialog.classList.add("is-closing");
    projectCloseTimer = window.setTimeout(finishProjectDialogClose, 200);
  };

  if (projectOpen instanceof HTMLButtonElement) {
    projectOpen.addEventListener("click", () => {
      projectDialog.classList.remove("is-closing");
      projectDialog.showModal();
    });
  }

  projectClose?.addEventListener("click", closeProjectDialog);
  projectDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeProjectDialog();
    }
  });
  projectDialog.addEventListener("animationend", (event) => {
    if (event.target === projectDialog && event.animationName === "project-dialog-exit") {
      window.clearTimeout(projectCloseTimer);
      finishProjectDialogClose();
    }
  });
  projectDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeProjectDialog();
  });
  projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) {
      closeProjectDialog();
    }
  });
}

if (contactForm instanceof HTMLFormElement && contactFormStatus instanceof HTMLElement) {
  const fields = [...contactForm.querySelectorAll("input, textarea")];

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      field.removeAttribute("aria-invalid");
      field.setCustomValidity("");
      contactFormStatus.textContent = "Formulir ini belum terhubung ke layanan pengiriman; pesan tidak akan dikirim.";
      contactFormStatus.classList.remove("is-error", "is-valid");
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    fields.forEach((field) => {
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        field.setCustomValidity("");
        const isBlank = field.value.trim().length === 0;
        if (isBlank && field.required) {
          field.setCustomValidity("Kolom ini wajib diisi.");
        } else if (field.name === "name" && field.value.trim().length < 2) {
          field.setCustomValidity("Nama harus berisi minimal 2 karakter.");
        } else if (field.name === "subject" && field.value.trim().length < 3) {
          field.setCustomValidity("Subjek harus berisi minimal 3 karakter.");
        } else if (field.name === "message" && field.value.trim().length < 10) {
          field.setCustomValidity("Pesan harus berisi minimal 10 karakter.");
        }
      }
    });

    const isValid = contactForm.reportValidity();
    fields.forEach((field) => {
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        field.toggleAttribute("aria-invalid", !field.validity.valid);
      }
    });

    if (!isValid) {
      contactFormStatus.textContent = "Periksa kembali kolom yang ditandai dan lengkapi formulir.";
      contactFormStatus.classList.add("is-error");
      contactFormStatus.classList.remove("is-valid");
      return;
    }

    contactFormStatus.textContent = "Format pesan valid. Pesan belum dikirim karena layanan pengiriman formulir belum dikonfigurasi.";
    contactFormStatus.classList.add("is-valid");
    contactFormStatus.classList.remove("is-error");
  });
}
