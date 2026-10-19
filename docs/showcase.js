const tabsRoot = document.querySelector("[data-tabs]");

if (tabsRoot) {
  const tabs = [...tabsRoot.querySelectorAll('[role="tab"]')];

  const selectTab = (selectedTab, moveFocus = false) => {
    for (const tab of tabs) {
      const selected = tab === selectedTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      panel.hidden = !selected;
    }

    if (moveFocus) selectedTab.focus();
  };

  tabsRoot.addEventListener("click", (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab && tabs.includes(tab)) selectTab(tab);
  });

  tabsRoot.addEventListener("keydown", (event) => {
    const currentIndex = tabs.indexOf(event.target);
    if (currentIndex < 0) return;

    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    if (nextIndex !== undefined) {
      event.preventDefault();
      selectTab(tabs[nextIndex], true);
    }
  });
}

const table = document.querySelector("#project-table");
const tableFilter = document.querySelector("#table-filter");
const tableFeedback = document.querySelector("#table-feedback");
let sortDirection = 1;
let sortedColumn = -1;

if (table && tableFilter && tableFeedback) {
  const rows = [...table.tBodies[0].rows];

  tableFilter.addEventListener("input", () => {
    const query = tableFilter.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    for (const row of rows) {
      const visible = row.textContent.toLocaleLowerCase().includes(query);
      row.hidden = !visible;
      if (visible) visibleCount += 1;
    }

    tableFeedback.textContent = query
      ? `${visibleCount} projet${visibleCount === 1 ? "" : "s"} affiché${visibleCount === 1 ? "" : "s"}.`
      : "";
  });

  table.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const column = Number(button.dataset.sort);
      if (column === sortedColumn) {
        sortDirection *= -1;
      } else {
        sortedColumn = column;
        sortDirection = 1;
      }
      for (const header of table.tHead.rows[0].cells) {
        header.removeAttribute("aria-sort");
      }
      button.closest("th").setAttribute("aria-sort", sortDirection === 1 ? "ascending" : "descending");
      rows.sort((rowA, rowB) => {
        const valueA = rowA.cells[column].textContent.trim();
        const valueB = rowB.cells[column].textContent.trim();
        return valueA.localeCompare(valueB, "fr", { numeric: true }) * sortDirection;
      });
      table.tBodies[0].append(...rows);
    });
  });
}

const volumeRange = document.querySelector("#volume-range");
const volumeValue = document.querySelector("#volume-value");

if (volumeRange && volumeValue) {
  volumeRange.addEventListener("input", () => {
    volumeValue.value = volumeRange.value;
    volumeValue.textContent = volumeRange.value;
  });
}

const demoForm = document.querySelector("#demo-form");
const formFeedback = document.querySelector("#form-feedback");

if (demoForm && formFeedback) {
  demoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = new FormData(demoForm).get("name");
    formFeedback.textContent = `Merci ${name}, votre demande de démonstration a bien été préparée.`;
  });
}

const toastRegion = document.querySelector("#toast-region");
let toastTimer;

if (toastRegion) {
  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => {
      toastRegion.replaceChildren();
      const toast = document.createElement("div");
      toast.className = "toast-message";
      toast.setAttribute("role", "status");
      toast.textContent = button.dataset.toast;
      toastRegion.append(toast);
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.remove(), 3200);
    });
  });
}

document.querySelectorAll("[data-dialog-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.dialogOpen);
    if (dialog instanceof HTMLDialogElement && !dialog.open) dialog.showModal();
  });
});

const pagination = document.querySelector(".am-pagination");
const paginationStatus = document.querySelector("#pagination-status");

if (pagination && paginationStatus) {
  const pageButtons = [...pagination.querySelectorAll("[data-page]")];
  const lastPage = pageButtons.length;
  let currentPage = 1;

  const selectPage = (page) => {
    currentPage = Math.max(1, Math.min(lastPage, page));
    for (const button of pageButtons) {
      if (Number(button.dataset.page) === currentPage) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    }
    pagination.querySelector('[data-page-step="-1"]').disabled = currentPage === 1;
    pagination.querySelector('[data-page-step="1"]').disabled = currentPage === lastPage;
    paginationStatus.textContent = `Page ${currentPage} sur ${lastPage}`;
  };

  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || !pagination.contains(button)) return;
    if (button.hasAttribute("data-page")) selectPage(Number(button.dataset.page));
    if (button.hasAttribute("data-page-step")) selectPage(currentPage + Number(button.dataset.pageStep));
  });
}

document.querySelectorAll("[data-copy-code]").forEach((button) => {
  const example = button.closest("[data-code-example]");
  const code = example?.querySelector("pre code");
  const status = example?.querySelector(".code-copy-status");

  if (!code || !status) {
    throw new Error("Chaque bouton de copie doit référencer un extrait et son statut.");
  }

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      status.textContent = "Code copié.";
    } catch (error) {
      status.textContent = "Copie impossible. Sélectionnez le code affiché.";
      console.error("Impossible de copier l'extrait de code.", error);
    }
  });
});

const requireWithin = (root, selector, feature) => {
  const element = root.querySelector(selector);
  if (!element) throw new Error(`${feature} : élément obligatoire introuvable (${selector}).`);
  return element;
};

document.querySelectorAll("[data-popover]").forEach((popover) => {
  const trigger = requireWithin(popover, "summary.am-popover-trigger", "Popover");
  requireWithin(popover, ".am-popover-panel", "Popover");
  let removeDismissListeners = () => {};

  const close = (returnFocus = false) => {
    popover.open = false;
    removeDismissListeners();
    removeDismissListeners = () => {};
    if (returnFocus) trigger.focus();
  };

  popover.addEventListener("toggle", () => {
    removeDismissListeners();
    removeDismissListeners = () => {};
    if (!popover.open) return;

    const onPointerDown = (event) => {
      if (!popover.contains(event.target)) close();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    removeDismissListeners = () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  });
});

document.querySelectorAll("[data-drawer]").forEach((root) => {
  const dialog = requireWithin(root, "dialog.am-drawer", "Drawer");
  if (!dialog.id) throw new Error("Drawer : la boîte de dialogue doit avoir un identifiant.");
  const openButton = [...root.querySelectorAll("[data-drawer-open]")].find((button) => button.dataset.drawerOpen === dialog.id);
  if (!openButton) throw new Error(`Drawer : bouton d'ouverture introuvable pour #${dialog.id}.`);
  const closeButtons = [...dialog.querySelectorAll("[data-drawer-close]")];
  if (closeButtons.length === 0) throw new Error(`Drawer #${dialog.id} : ajoutez au moins un bouton data-drawer-close.`);

  openButton.addEventListener("click", () => {
    if (!dialog.open) dialog.showModal();
  });
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (dialog.open) dialog.close();
    });
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

document.querySelectorAll("[data-sidebar-demo]").forEach((root) => {
  const toggle = requireWithin(root, "[data-sidebar-toggle]", "Navigation");
  const controlledId = toggle.getAttribute("aria-controls");
  const navigation = controlledId && document.getElementById(controlledId);
  if (!navigation || !root.contains(navigation)) {
    throw new Error("Navigation : aria-controls doit référencer une navigation présente dans la démonstration.");
  }

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    navigation.hidden = expanded;
    toggle.textContent = expanded ? "Afficher les liens" : "Masquer les liens";
  });
});

document.querySelectorAll("[data-combobox]").forEach((root) => {
  const input = requireWithin(root, '[role="combobox"]', "Combobox");
  const list = requireWithin(root, '[role="listbox"]', "Combobox");
  const status = requireWithin(root, "[data-combobox-status]", "Combobox");
  const options = [...list.querySelectorAll('[role="option"]')];
  const emptyState = requireWithin(list, "[data-combobox-empty]", "Combobox");
  if (options.length === 0) throw new Error("Combobox : ajoutez au moins une option dans la listbox.");
  if (!list.id || input.getAttribute("aria-controls") !== list.id) {
    throw new Error("Combobox : aria-controls doit référencer l'identifiant de la listbox.");
  }
  if (options.some((option) => !option.id)) throw new Error("Combobox : chaque option doit avoir un identifiant unique.");

  let visibleOptions = options;
  let activeIndex = -1;
  let selectedValue = "";
  let dismissListener;

  const setActive = (index) => {
    activeIndex = index;
    options.forEach((option, optionIndex) => {
      const activeOption = visibleOptions[activeIndex];
      option.setAttribute("aria-selected", String(
        option === activeOption || (activeIndex < 0 && option.dataset.value === selectedValue)
      ));
    });
    if (activeIndex >= 0) {
      const activeOption = visibleOptions[activeIndex];
      input.setAttribute("aria-activedescendant", activeOption.id);
      activeOption.scrollIntoView({ block: "nearest" });
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  };

  const close = () => {
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    setActive(-1);
    if (dismissListener) document.removeEventListener("pointerdown", dismissListener);
    dismissListener = undefined;
  };

  const open = () => {
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
    if (!dismissListener) {
      dismissListener = (event) => {
        if (!root.contains(event.target)) close();
      };
      document.addEventListener("pointerdown", dismissListener);
    }
  };

  const filterOptions = () => {
    const query = input.value.trim().toLocaleLowerCase();
    visibleOptions = options.filter((option) => option.textContent.trim().toLocaleLowerCase().includes(query));
    options.forEach((option) => {
      option.hidden = !visibleOptions.includes(option);
    });
    emptyState.hidden = visibleOptions.length > 0;
    setActive(-1);
    open();
    status.textContent = visibleOptions.length === 0
      ? "Aucun résultat. Modifiez votre recherche."
      : `${visibleOptions.length} résultat${visibleOptions.length === 1 ? "" : "s"} disponible${visibleOptions.length === 1 ? "" : "s"}.`;
  };

  const select = (option) => {
    selectedValue = option.dataset.value ?? option.textContent.trim();
    input.value = selectedValue;
    status.textContent = `${selectedValue} sélectionné.`;
    close();
  };

  input.addEventListener("focus", filterOptions);
  input.addEventListener("input", filterOptions);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !list.hidden) {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (list.hidden) open();
      if (visibleOptions.length === 0) return;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const start = activeIndex < 0 ? (direction > 0 ? -1 : 0) : activeIndex;
      setActive((start + direction + visibleOptions.length) % visibleOptions.length);
    } else if ((event.key === "Home" || event.key === "End") && !list.hidden && visibleOptions.length > 0) {
      event.preventDefault();
      setActive(event.key === "Home" ? 0 : visibleOptions.length - 1);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      select(visibleOptions[activeIndex]);
    }
  });
  list.addEventListener("pointerdown", (event) => {
    if (event.target.closest('[role="option"]')) event.preventDefault();
  });
  list.addEventListener("click", (event) => {
    const option = event.target.closest('[role="option"]');
    if (option && visibleOptions.includes(option)) select(option);
  });
});

document.querySelectorAll("[data-calendar]").forEach((input) => {
  const demo = input.closest(".component-family-demo");
  if (!demo) throw new Error("Date picker : placez le champ dans son conteneur de démonstration.");
  const status = requireWithin(demo, "#review-date-status", "Date picker");
  input.addEventListener("change", () => {
    status.textContent = input.value
      ? `Date sélectionnée : ${new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(`${input.value}T12:00:00`))}.`
      : "Aucune date sélectionnée.";
  });
});

document.querySelectorAll("[data-carousel]").forEach((root) => {
  const slides = [...root.querySelectorAll("[data-carousel-slide]")];
  const status = requireWithin(root, "[data-carousel-status]", "Carousel");
  const dots = [...root.querySelectorAll("[data-carousel-page]")];
  const previous = requireWithin(root, '[data-carousel-step="-1"]', "Carousel");
  const next = requireWithin(root, '[data-carousel-step="1"]', "Carousel");
  if (slides.length === 0 || slides.length !== dots.length) {
    throw new Error("Carousel : chaque diapositive visible doit avoir un bouton de navigation correspondant.");
  }
  if (slides.some((slide) => !slide.querySelector("h5"))) {
    throw new Error("Carousel : chaque diapositive doit contenir un titre h5 pour son annonce accessible.");
  }

  let current = slides.findIndex((slide) => !slide.hidden);
  if (current < 0) throw new Error("Carousel : affichez une première diapositive au chargement.");

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== current;
    });
    dots.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", String(dotIndex === current));
    });
    status.textContent = `Projet ${current + 1} sur ${slides.length} : ${slides[current].querySelector("h5").textContent.trim()}`;
  };

  root.addEventListener("click", (event) => {
    const stepButton = event.target.closest("[data-carousel-step]");
    if (stepButton && root.contains(stepButton)) {
      showSlide(current + Number(stepButton.dataset.carouselStep));
      return;
    }
    const pageButton = event.target.closest("[data-carousel-page]");
    if (pageButton && root.contains(pageButton)) showSlide(Number(pageButton.dataset.carouselPage));
  });
  root.addEventListener("keydown", (event) => {
    if (event.target.closest("input, textarea, select")) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(current + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
});

document.querySelectorAll("[data-menubar]").forEach((menubar) => {
  const items = [...menubar.querySelectorAll('[role="menuitem"]')];
  if (items.length === 0) throw new Error("Menubar : ajoutez au moins un élément role=menuitem.");
  items.forEach((item, index) => {
    item.tabIndex = index === 0 ? 0 : -1;
  });
  menubar.addEventListener("keydown", (event) => {
    const current = items.indexOf(event.target);
    if (current < 0) return;
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (current + 1) % items.length;
    if (event.key === "ArrowLeft") nextIndex = (current - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      items[current].tabIndex = -1;
      items[nextIndex].tabIndex = 0;
      items[nextIndex].focus();
    }
  });
});

document.querySelectorAll("[data-context-menu]").forEach((root) => {
  const trigger = requireWithin(root, "[data-context-trigger]", "Context menu");
  const menu = requireWithin(root, '[role="menu"]', "Context menu");
  const status = requireWithin(root, "[data-context-status]", "Context menu");
  const items = [...menu.querySelectorAll('[role="menuitem"]')];
  if (items.length === 0) throw new Error("Context menu : ajoutez au moins un élément role=menuitem.");
  if (trigger.getAttribute("aria-controls") !== menu.id || !menu.id) {
    throw new Error("Context menu : aria-controls doit référencer l'identifiant du menu.");
  }

  let removeDismissListeners = () => {};
  const close = (returnFocus = false) => {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    removeDismissListeners();
    removeDismissListeners = () => {};
    if (returnFocus) trigger.focus();
  };
  const open = () => {
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    items.forEach((item, index) => {
      item.tabIndex = index === 0 ? 0 : -1;
    });
    items[0].focus();
    const onPointerDown = (event) => {
      if (!root.contains(event.target)) close();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      const current = items.indexOf(event.target);
      if (current < 0) return;
      let nextIndex;
      if (event.key === "ArrowDown") nextIndex = (current + 1) % items.length;
      if (event.key === "ArrowUp") nextIndex = (current - 1 + items.length) % items.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = items.length - 1;
      if (nextIndex !== undefined) {
        event.preventDefault();
        items[current].tabIndex = -1;
        items[nextIndex].tabIndex = 0;
        items[nextIndex].focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("keydown", onKeyDown);
    removeDismissListeners = () => {
      document.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("keydown", onKeyDown);
    };
  };

  trigger.addEventListener("click", () => {
    if (menu.hidden) open();
    else close();
  });
  menu.addEventListener("click", (event) => {
    const item = event.target.closest('[role="menuitem"]');
    if (!item || !items.includes(item)) return;
    status.textContent = `${item.textContent.trim()} : action sélectionnée.`;
    close(true);
  });
});
