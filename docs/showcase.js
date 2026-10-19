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
