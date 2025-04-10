// Toggle the visibility of the template container
function toggleTemplates() {
  const templateContainer = document.getElementById("templateContainer");

  // Check if the container already has the "show" class
  if (templateContainer.classList.contains("show")) {
    templateContainer.classList.remove("show"); // Hide the side pane
    document.removeEventListener("click", closeOnClickOutside);
  } else {
    templateContainer.classList.add("show"); // Show the side pane
    setTimeout(() => {
      document.addEventListener("click", closeOnClickOutside);
    }, 0); // Delay to prevent immediate closure
  }
}

function closeTemplatePane() {
  const templateContainer = document.getElementById("templateContainer");

  // Remove the "show" class to hide the side pane
  templateContainer.classList.remove("show");
  document.removeEventListener("click", closeOnClickOutside);
}

// Function to close the pane when clicking outside of it
function closeOnClickOutside(event) {
  const templateContainer = document.getElementById("templateContainer");
  if (templateContainer && !templateContainer.contains(event.target)) {
    closeTemplatePane();
  }
}

function showAlert(message) {
  document.getElementById("alert-message").textContent = message;
  document.getElementById("custom-alert").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeAlert() {
  const alert = document.getElementById("custom-alert");
  alert.style.opacity = "0";
  alert.style.transition = "opacity 0.3s ease";

  setTimeout(() => {
    alert.style.display = "none";
    alert.style.opacity = "1";
    document.body.style.overflow = "auto";
  }, 300);
}

// Close when clicking outside the alert box
document
  .getElementById("custom-alert")
  .addEventListener("click", function (event) {
    if (event.target === this) {
      closeAlert();
    }
  });

// Toggle the visibility of the themes container
function toggleThemes() {
  const themesContainer = document.getElementById("themesContainer");

  // Check if the container is already shown
  if (themesContainer.classList.contains("show")) {
    themesContainer.classList.remove("show"); // Hide the themes pane
    document.removeEventListener("click", closeOnClickOutsideThemes);
  } else {
    themesContainer.classList.add("show"); // Show the themes pane
    setTimeout(() => {
      document.addEventListener("click", closeOnClickOutsideThemes);
    }, 0); // Delay to prevent immediate closure
  }
}

function closeThemePane() {
  const themesContainer = document.getElementById("themesContainer");

  // Remove the "show" class to hide the themes pane
  themesContainer.classList.remove("show");
  document.removeEventListener("click", closeOnClickOutsideThemes);
}

// Function to close the pane when clicking outside of it
function closeOnClickOutsideThemes(event) {
  const themesContainer = document.getElementById("themesContainer");
  if (themesContainer && !themesContainer.contains(event.target)) {
    closeThemePane();
  }
}

// Toggle the visibility of the Add Table popup
function toggleAddTablePopup() {
  const addTablePopup = document.getElementById("addTablePopup");

  // Check if the popup is already shown
  if (addTablePopup.classList.contains("show")) {
    addTablePopup.classList.remove("show"); // Hide the popup
    document.removeEventListener("click", closeOnClickOutsideTable);
  } else {
    addTablePopup.classList.add("show"); // Show the popup
    setTimeout(() => {
      document.addEventListener("click", closeOnClickOutsideTable);
    }, 0); // Delay to prevent immediate closure
  }
}

function closeAddTablePane() {
  const addTablePopup = document.getElementById("addTablePopup");

  // Remove the "show" class to hide the popup
  addTablePopup.classList.remove("show");
  document.removeEventListener("click", closeOnClickOutsideTable);
}

// Function to close the popup when clicking outside of it
function closeOnClickOutsideTable(event) {
  const addTablePopup = document.getElementById("addTablePopup");
  if (addTablePopup && !addTablePopup.contains(event.target)) {
    closeAddTablePane();
  }
}

// Toggle the visibility of the Add Image popup
function toggleAddImagePopup() {
  const imagePane = document.getElementById("imageuploads");

  // Check if the popup is already shown
  if (imagePane.classList.contains("show")) {
    imagePane.classList.remove("show"); // Hide the popup
    document.removeEventListener("click", closeOnClickOutsideImage);
  } else {
    imagePane.classList.add("show"); // Show the popup
    setTimeout(() => {
      document.addEventListener("click", closeOnClickOutsideImage);
    }, 0); // Delay to prevent immediate closure
  }
}

function closeAddImagePane() {
  const imagePane = document.getElementById("imageuploads");

  // Remove the "show" class to hide the popup
  imagePane.classList.remove("show");
  document.removeEventListener("click", closeOnClickOutsideImage);
}

// Function to close the popup when clicking outside of it
function closeOnClickOutsideImage(event) {
  const imagePane = document.getElementById("imageuploads");
  if (imagePane && !imagePane.contains(event.target)) {
    closeAddImagePane();
  }
}

// Toggle the Side Pane
let selectedHeading = null; // Variable to track selected heading style

// Toggle the visibility of the Headings Pane
function toggleHeadingsPane() {
  const pane = document.getElementById("headingsPane");

  // Check if the pane is already shown
  if (pane.classList.contains("show")) {
    pane.classList.remove("show"); // Hide the pane
    document.removeEventListener("click", closeOnClickOutsideHeadings);
  } else {
    pane.classList.add("show"); // Show the pane
    setTimeout(() => {
      document.addEventListener("click", closeOnClickOutsideHeadings);
    }, 0); // Delay to prevent immediate closure
  }
}

// Function to close the pane when clicking outside of it
function closeOnClickOutsideHeadings(event) {
  const pane = document.getElementById("headingsPane");
  if (pane && !pane.contains(event.target)) {
    pane.classList.remove("show");
    document.removeEventListener("click", closeOnClickOutsideHeadings);
  }
}

// Function to select a heading style
function selectHeading(styleClass) {
  const tableContent = document.getElementById(
    "custom-template-heading-container"
  );
  tableContent.innerHTML = `<h1 class="${styleClass}">Japanese Language Training Report</h1>`;
  selectedHeading = tableContent.querySelector("h1"); // Store the selected heading element
  // Close the side pane after selection
}

// Function to update the heading's styles based on user inputs
function updateHeadingStyle() {
  if (!selectedHeading) return; // If no heading is selected, do nothing

  // Get the values from the input fields
  const textColor = document.getElementById("text-color").value;
  const bgColor = document.getElementById("bg-color").value;
  const borderRadius = document.getElementById("border-radius").value;

  // Apply the selected styles to the heading
  selectedHeading.style.color = textColor;
  selectedHeading.style.backgroundColor = bgColor;
  selectedHeading.style.borderRadius = borderRadius + "px";
}

// Toggle the visibility of the Graphs Pane
function toggleGraphsPane() {
  const graphsPane = document.getElementById("graphsPane");

  // Check if the pane is already shown
  if (graphsPane.classList.contains("show")) {
    graphsPane.classList.remove("show"); // Hide the pane
    document.removeEventListener("click", closeOnClickOutsideGraphs);
  } else {
    graphsPane.classList.add("show"); // Show the pane
    setTimeout(() => {
      document.addEventListener("click", closeOnClickOutsideGraphs);
    }, 0); // Delay to prevent immediate closure
  }
}

// Function to close the pane when clicking outside of it
function closeOnClickOutsideGraphs(event) {
  const graphsPane = document.getElementById("graphsPane");
  if (graphsPane && !graphsPane.contains(event.target)) {
    graphsPane.classList.remove("show");
    document.removeEventListener("click", closeOnClickOutsideGraphs);
  }
}

// Function to handle click event on the source div
function moveContent(event) {
  const sourceDiv = event.currentTarget; // The clicked div
  const targetDiv = document.getElementById("custom-template-table-container"); // The target div

  if (targetDiv) {
    // Move all child nodes (content) from the source div to the target div
    while (sourceDiv.firstChild) {
      targetDiv.appendChild(sourceDiv.firstChild);
    }
  }
}

// Function to handle click event on the delete button
function deleteContent(event) {
  const deleteButton = event.currentTarget; // The clicked delete button
  const containerDiv = deleteButton.parentElement; // The container div
  const sourceTable = document.getElementById("custom-dynamic-table-user"); // The source table

  if (sourceTable) {
    // Move all child nodes (content) back to the source table
    while (containerDiv.firstChild) {
      if (containerDiv.firstChild !== deleteButton) {
        // Skip the delete button
        sourceTable.appendChild(containerDiv.firstChild);
      }
    }
  }
  containerDiv.remove(); // Remove the container div from the target container
}

function dragStart(event) {
  event.dataTransfer.setData("text", event.target.dataset.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData("text");
  const mainContainer = document.getElementById(
    "custom-template-graph-container"
  );

  if (!mainContainer.querySelector(`[data-id="${draggedId}"]`)) {
    const draggedElement = document.querySelector(`[data-id="${draggedId}"]`);
    if (draggedElement) {
      const originalParent = draggedElement.parentElement;
      const newDiv = document.createElement("div");
      newDiv.setAttribute("data-id", draggedId);
      newDiv.classList.add("box-template-custom-user");

      // Store original content and parent reference
      const originalContent = Array.from(draggedElement.children);
      while (draggedElement.firstChild) {
        newDiv.appendChild(draggedElement.firstChild);
      }

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.className = "delete-btn";
      Object.assign(deleteBtn.style, {
        position: "absolute",
        top: "5px",
        right: "5px",
        padding: "5px",
        cursor: "pointer",
        border: "none",
        backgroundColor: "#f44336",
        color: "white",
        borderRadius: "4px",
      });

      // Modified delete button click handler
      deleteBtn.onclick = () => {
        // Return content to original element
        originalContent.forEach((child) => {
          // Skip the delete button when returning content
          if (!child.classList.contains("delete-btn")) {
            draggedElement.appendChild(child);
          }
        });
        // Remove the container div
        newDiv.remove();
      };

      newDiv.appendChild(deleteBtn);

      Object.assign(newDiv.style, {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        margin: "5px",
        cursor: "se-resize",
        flex: "1 1 auto",
      });

      let isResizing = false;
      let originalWidth, originalHeight, originalX, originalY;

      function getMaxAllowedWidth() {
        const containerWidth = mainContainer.clientWidth;
        const margin = 10;
        const divsInRow = getDivsInSameRow(newDiv);
        const totalMargins = (divsInRow.length + 1) * margin;
        let otherDivsWidth = 0;

        divsInRow.forEach((div) => {
          if (div !== newDiv) {
            otherDivsWidth += div.offsetWidth;
          }
        });

        return containerWidth - otherDivsWidth - totalMargins;
      }

      function getDivsInSameRow(targetDiv) {
        const divsInRow = [];
        const targetRect = targetDiv.getBoundingClientRect();

        Array.from(mainContainer.children).forEach((child) => {
          const childRect = child.getBoundingClientRect();
          if (Math.abs(childRect.top - targetRect.top) < 5) {
            divsInRow.push(child);
          }
        });

        return divsInRow;
      }

      function handleResize(e) {
        if (!isResizing) return;

        const maxWidth = getMaxAllowedWidth();
        const newWidth = originalWidth + (e.clientX - originalX);
        const newHeight = originalHeight + (e.clientY - originalY);
        const divsInRow = getDivsInSameRow(newDiv);

        if (newWidth >= 150) {
          newDiv.style.width = Math.min(newWidth, maxWidth) + "px";

          if (divsInRow.length === 3 && newWidth > maxWidth) {
            const nextRowDivs = Array.from(mainContainer.children).filter(
              (div) => {
                const divRect = div.getBoundingClientRect();
                const newDivRect = newDiv.getBoundingClientRect();
                return (
                  divRect.top > newDivRect.top &&
                  divRect.top < newDivRect.top + newDivRect.height + 50
                );
              }
            );

            if (nextRowDivs.length > 0) {
              newDiv.style.width =
                containerWidth -
                nextRowDivs.reduce(
                  (sum, div) => sum + div.offsetWidth + 10,
                  0
                ) -
                20 +
                "px";
            }
          }
        }

        if (newHeight >= 100) {
          newDiv.style.height = newHeight + "px";
        }

        Array.from(newDiv.children).forEach((child) => {
          if (child !== deleteBtn) {
            child.style.maxWidth = "100%";
            child.style.maxHeight = "100%";
            child.style.objectFit = "contain";
          }
        });
      }

      newDiv.addEventListener("mousedown", function (e) {
        const box = newDiv.getBoundingClientRect();
        const clickRegion = 20;

        if (
          e.clientX > box.right - clickRegion &&
          e.clientY > box.bottom - clickRegion
        ) {
          isResizing = true;
          originalWidth = parseFloat(
            getComputedStyle(newDiv, null)
              .getPropertyValue("width")
              .replace("px", "")
          );
          originalHeight = parseFloat(
            getComputedStyle(newDiv, null)
              .getPropertyValue("height")
              .replace("px", "")
          );
          originalX = e.clientX;
          originalY = e.clientY;
          e.preventDefault();
        }
      });

      document.addEventListener("mousemove", handleResize);

      document.addEventListener("mouseup", function () {
        isResizing = false;
      });

      const divsInLastRow = getDivsInSameRow(
        mainContainer.lastElementChild || newDiv
      );
      if (divsInLastRow.length >= 3) {
        newDiv.style.flexBasis = "auto";
      }

      mainContainer.appendChild(newDiv);
    }
  }
}

const layouts = [
  // 1. Two equal columns
  function twoEqualColumns() {
    applyGridLayout({
      gridColumns: "repeat(2, minmax(0, 1fr))",
      gap: "8px",
      callback: (div) => {
        div.style.minHeight = "150px";
      },
    });
  },

  // 2. Three equal columns
  function threeEqualColumns() {
    applyGridLayout({
      gridColumns: "repeat(3, minmax(0, 1fr))",
      gap: "8px",
      callback: (div) => {
        div.style.minHeight = "200px";
      },
    });
  },

  // 3. One large + smaller ones
  function oneLargeFourSmall() {
    applyGridLayout({
      gridColumns: "repeat(3, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index) => {
        if (index === 0) {
          div.style.gridColumn = "span 3";
          div.style.minHeight = "200px";
        } else {
          div.style.minHeight = "150px";
        }
      },
    });
  },

  // 4. Two rows, two columns
  function twoByTwo() {
    applyGridLayout({
      gridColumns: "repeat(2, minmax(0, 1fr))",
      gap: "8px",
      callback: (div) => {
        div.style.minHeight = "180px";
      },
    });
  },

  // 5. Vertical stack
  function verticalStack() {
    applyGridLayout({
      gridColumns: "1fr",
      gap: "8px",
      callback: (div) => {
        div.style.minHeight = "120px";
      },
    });
  },

  // 6. Pyramid (top wide, bottom split)
  function pyramid() {
    applyGridLayout({
      gridColumns: "repeat(2, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index) => {
        if (index === 0) {
          div.style.gridColumn = "span 2";
          div.style.minHeight = "200px";
        } else {
          div.style.minHeight = "150px";
        }
      },
    });
  },

  // 7. Alternating spans
  function alternatingSpans() {
    applyGridLayout({
      gridColumns: "repeat(2, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index) => {
        if (index % 2 === 0) {
          div.style.gridColumn = "span 2";
          div.style.minHeight = "180px";
        } else {
          div.style.minHeight = "150px";
        }
      },
    });
  },

  // 8. Three rows
  function threeRows() {
    applyGridLayout({
      gridColumns: "repeat(2, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index) => {
        if (index < 2) {
          div.style.gridColumn = "span 2";
        }
        div.style.minHeight = "140px";
      },
    });
  },

  // 9. Mixed layout
  function mixedLayout() {
    applyGridLayout({
      gridColumns: "repeat(3, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index) => {
        if (index === 0) {
          div.style.gridColumn = "span 2";
        }
        div.style.minHeight = "160px";
      },
    });
  },

  // 10. Compact grid
  function compactGrid() {
    applyGridLayout({
      gridColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "8px",
      callback: (div) => {
        div.style.minHeight = "160px";
      },
    });
  },

  // 11. Mosaic
  function mosaic() {
    applyGridLayout({
      gridColumns: "repeat(3, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index) => {
        if (index === 0) {
          div.style.gridColumn = "span 2";
          div.style.gridRow = "span 2";
          div.style.minHeight = "300px";
        } else {
          div.style.minHeight = "150px";
        }
      },
    });
  },

  // 12. Split view
  function splitView() {
    applyGridLayout({
      gridColumns: "repeat(2, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index) => {
        div.style.minHeight = index === 0 ? "250px" : "180px";
      },
    });
  },

  // 13. Dynamic rows
  function dynamicRows() {
    applyGridLayout({
      gridColumns: "repeat(2, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index, total) => {
        if (total <= 3 && index === 0) {
          div.style.gridColumn = "span 2";
        }
        div.style.minHeight = "160px";
      },
    });
  },

  // 14. Asymmetric grid
  function asymmetricGrid() {
    applyGridLayout({
      gridColumns: "repeat(3, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index) => {
        if (index === 0) {
          div.style.gridColumn = "span 2";
          div.style.minHeight = "200px";
        } else if (index === 1) {
          div.style.gridRow = "span 2";
          div.style.minHeight = "300px";
        } else {
          div.style.minHeight = "150px";
        }
      },
    });
  },

  // 15. Flexible grid
  function flexibleGrid() {
    applyGridLayout({
      gridColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "8px",
      callback: (div) => {
        div.style.minHeight = "180px";
      },
    });
  },

  // 16. Centered focus
  function centeredFocus() {
    applyGridLayout({
      gridColumns: "repeat(3, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index) => {
        if (index === 1) {
          div.style.gridColumn = "span 2";
          div.style.minHeight = "250px";
        } else {
          div.style.minHeight = "150px";
        }
      },
    });
  },

  // 17. Zigzag layout
  function zigzagLayout() {
    applyGridLayout({
      gridColumns: "repeat(2, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index) => {
        if (index % 2 === 0) {
          div.style.gridColumn = "1 / 2";
        } else {
          div.style.gridColumn = "2 / 3";
        }
        div.style.minHeight = "160px";
      },
    });
  },

  // 18. Staggered grid
  function staggeredGrid() {
    applyGridLayout({
      gridColumns: "repeat(4, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index) => {
        if (index % 2 === 0) {
          div.style.gridColumn = "span 2";
        }
        div.style.minHeight = "180px";
      },
    });
  },

  // 19. Full-width header
  function fullWidthHeader() {
    applyGridLayout({
      gridColumns: "1fr",
      gap: "8px",
      callback: (div, index) => {
        if (index === 0) {
          div.style.minHeight = "200px";
        } else {
          div.style.minHeight = "120px";
        }
      },
    });
  },

  // 20. Diagonal split
  function diagonalSplit() {
    applyGridLayout({
      gridColumns: "repeat(2, minmax(0, 1fr))",
      gap: "8px",
      callback: (div, index) => {
        if (index === 0) {
          div.style.gridColumn = "1 / 2";
          div.style.gridRow = "1 / 2";
        } else if (index === 1) {
          div.style.gridColumn = "2 / 3";
          div.style.gridRow = "2 / 3";
        }
        div.style.minHeight = "180px";
      },
    });
  },
];

// ... Previous layout functions remain the same ...

// Updated utility function with 5px padding
// Updated utility function with 5px padding
function applyGridLayout({ gridColumns, gap, callback }) {
  const container = document.getElementById("custom-template-graph-container");
  const divs = Array.from(
    container.getElementsByClassName("box-template-custom-user")
  );

  // Only proceed if we have 2-6 divs
  if (divs.length < 2 || divs.length > 6) return;

  // Reset container styles
  container.style.cssText = "";

  // Apply container styles
  Object.assign(container.style, {
    display: "grid",
    gridTemplateColumns: gridColumns,
    gap: gap,
    // padding: '5px',
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    minHeight: "min-content",
  });

  // Reset and apply styles to each div
  divs.forEach((div, index) => {
    // Reset div styles
    div.style.cssText = "";

    // Apply base styles
    Object.assign(div.style, {
      width: "100%",
      height: "100%",
      margin: "0",
      padding: "5px", // Updated to 5px
      overflow: "hidden",
      backgroundColor: "#f5f5f5",
      borderRadius: "8px",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    });

    // Create or get content wrapper
    let wrapper = div.querySelector(".content-wrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "content-wrapper";
      // Move div's content to wrapper
      while (div.firstChild) {
        wrapper.appendChild(div.firstChild);
      }
      div.appendChild(wrapper);
    }

    // Style content wrapper with column-wise layout
    Object.assign(wrapper.style, {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column", // Change to column-wise layout
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      transform: "scale(1)",
      transition: "transform 0.2s",
    });

    // Apply custom styles if callback provided
    if (callback) {
      callback(div, index, divs.length);
    }

    // Function to scale content to fit
    function scaleContentToFit() {
      const content = wrapper;
      const parent = div;

      // Reset scale to measure true size
      content.style.transform = "scale(1)";

      // Get measurements (account for 5px padding)
      const parentWidth = parent.clientWidth - 10; // 5px padding on each side
      const parentHeight = parent.clientHeight - 10; // 5px padding on each side
      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;

      // Calculate scale factors
      const scaleX = parentWidth / contentWidth;
      const scaleY = parentHeight / contentHeight;

      // Use the smaller scale to ensure content fits both dimensions
      const scale = Math.min(scaleX, scaleY, 1); // Never scale up, only down

      // Apply the scale transform
      content.style.transform = `scale(${scale})`;
    }

    // Scale content initially
    scaleContentToFit();

    // Add resize observer to handle dynamic content changes
    const resizeObserver = new ResizeObserver(() => {
      scaleContentToFit();
    });

    resizeObserver.observe(div);
    resizeObserver.observe(wrapper);
  });
}

// Track layout usage
let usedLayouts = new Set();
let currentLayoutIndex = 0; // Start at the first layout

// Function to get the next layout (sequentially)
function getNextLayoutGrapgh() {
  // Get the current layout and increment the index
  const nextIndex = currentLayoutIndex;
  currentLayoutIndex = (currentLayoutIndex + 1) % layouts.length; // Loop back after the last layout
  return layouts[nextIndex];
}

// Function to apply next layout
function randomizeLayout() {
  const nextLayout = getNextLayoutGrapgh();
  nextLayout(); // Apply the next layout
}

// 1. Two-column Layout (for all divs inside the container)
function twoColumnsLayout() {
  const batchInfoDivs = document.querySelectorAll(".batch-info-custom-user");

  batchInfoDivs.forEach((div) => {
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.gap = "30px";
    div.style.padding = "10px";
    div.style.width = "100%";
    div.style.height = "auto";

    // Ensure elements order: heading at the center
    const [p1, h1, p2] = div.children;
    p1.style.order = "1";
    h1.style.order = "2";
    p2.style.order = "3";

    // Center align text
    h1.style.textAlign = "center";
  });
}

// 2. Vertical Stack Layout (for all divs inside the container)
function verticalStackLayout() {
  const batchInfoDivs = document.querySelectorAll(".batch-info-custom-user");

  batchInfoDivs.forEach((div) => {
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.style.gap = "15px";
    div.style.padding = "10px";
    div.style.width = "100%";
    div.style.height = "auto";

    // Align all text to center
    div.querySelectorAll("p, h1").forEach((elem) => {
      elem.style.textAlign = "center";
    });
  });
}

// 3. Split Top-Bottom Layout (Batch Info first, then others)
function splitTopBottomLayout() {
  const batchInfoDivs = document.querySelectorAll(".batch-info-custom-user");

  batchInfoDivs.forEach((div) => {
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.gap = "10px";
    div.style.padding = "10px";
    div.style.width = "100%";
    div.style.height = "auto";

    const paragraphs = div.querySelectorAll("p");
    const heading = div.querySelector("h1");

    if (paragraphs.length >= 2 && heading) {
      // Create a new container for paragraphs
      const infoContainer = document.createElement("div");
      infoContainer.style.display = "flex";
      infoContainer.style.justifyContent = "space-between";
      infoContainer.style.gap = "20px";

      infoContainer.appendChild(paragraphs[0]);
      infoContainer.appendChild(paragraphs[1]);

      // Append elements in correct order
      div.appendChild(heading);
      div.appendChild(infoContainer);
    }
  });
}

// 4. Horizontal Split Layout (Two rows for each div)
function horizontalSplitLayout() {
  const batchInfoDivs = document.querySelectorAll(".batch-info-custom-user");

  batchInfoDivs.forEach((div) => {
    div.style.display = "flex";
    div.style.flexDirection = "row-reverse";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.padding = "10px";
    div.style.width = "100%";
    div.style.gap = "30px";
    div.style.height = "auto";

    const [p1, h1, p2] = div.children;
    p1.style.order = "3"; // Move first p to the end
    h1.style.order = "2"; // Keep h1 in the center
    p2.style.order = "1"; // Move second p to the beginning
  });
}

// 5. Centered Layout with Flexbox (Centered with a fixed width)
function centeredLayout() {
  const batchInfoDivs = document.querySelectorAll(".batch-info-custom-user");

  batchInfoDivs.forEach((div) => {
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "center";
    div.style.gap = "10px";
    div.style.padding = "10px";
    div.style.width = "100%";
    div.style.height = "auto";

    const paragraphs = div.querySelectorAll("p");
    const heading = div.querySelector("h1");

    if (paragraphs.length >= 2 && heading) {
      // Create a container for paragraphs
      const infoContainer = document.createElement("div");
      infoContainer.style.display = "flex";
      infoContainer.style.justifyContent = "center";
      infoContainer.style.gap = "20px";

      infoContainer.appendChild(paragraphs[0]);
      infoContainer.appendChild(paragraphs[1]);

      // Append elements in correct order
      div.appendChild(heading);
      div.appendChild(infoContainer);
    }
  });
}

// Array of layout functions
const layoutsTable = [
  twoColumnsLayout,
  verticalStackLayout,
  splitTopBottomLayout,

  centeredLayout,
];

// Track the current layout index
let currentLayoutIndexTable = 0;

// Function to get the next layout
function getNextLayout() {
  if (currentLayoutIndexTable >= layoutsTable.length) {
    currentLayoutIndexTable = 0; // Reset to the first layout after 5
  }
  return layoutsTable[currentLayoutIndexTable++];
}

// Function to apply the layout
function applyLayout() {
  const nextLayout = getNextLayout();
  nextLayout(); // Apply the layout
}

// Button click handler to change layout
document
  .getElementById("changeLayoutBtn")
  .addEventListener("click", applyLayout);

// Toggle between row and column layout
function toggleLayout(layoutType) {
  const container = document.getElementById("custom-template-graph-container");

  // Ensure the container exists before applying layout changes
  if (container) {
    if (layoutType === "row") {
      container.style.flexDirection = "row";
      container.style.flexWrap = "wrap"; // Allow wrapping in row layout
    } else if (layoutType === "column") {
      container.style.flexDirection = "column";
      container.style.flexWrap = "nowrap"; // No wrapping in column layout
    }
  }
}

function updateDivsPerRow() {
  const container = document.getElementById("custom-template-graph-container");
  const divsPerRow = parseInt(document.getElementById("divsPerRow").value, 10);

  if (!divsPerRow || divsPerRow <= 0) {
    // alert("Please enter a valid number greater than 0");
    showAlert("Please enter a valid number greater than 0");
    return;
  }

  // Calculate the width percentage for each div
  const divWidth = 100 / divsPerRow;

  // Apply the calculated width to each child div
  Array.from(container.children).forEach((child) => {
    child.style.flexBasis = `${divWidth}%`; // Set flex-basis for equal spacing
  });
}

function hideDeleteButtons() {
  // Select all delete buttons and draggable divs inside the container
  const deleteButtons = document.querySelectorAll(".delete-btn");
  const draggableDivs = document.querySelectorAll(
    "#custom-template-graph-container > div"
  );

  // Loop through each button and hide it
  deleteButtons.forEach((button) => {
    button.style.display = "none";
  });

  // Disable drag-and-drop functionality for the divs
  draggableDivs.forEach((div) => {
    div.setAttribute("draggable", "false"); // Disable dragging
    div.style.pointerEvents = "none"; // Disable interactions
  });
}

function showDeleteButtons() {
  // Select all delete buttons and draggable divs inside the container
  const deleteButtons = document.querySelectorAll(".delete-btn");
  const draggableDivs = document.querySelectorAll(
    "#custom-template-graph-container > div"
  );

  // Loop through each button and show it
  deleteButtons.forEach((button) => {
    button.style.display = "block";
  });

  // Enable drag-and-drop functionality for the divs
  draggableDivs.forEach((div) => {
    div.setAttribute("draggable", "true"); // Enable dragging
    div.style.pointerEvents = "auto"; // Enable interactions
  });
}



// Toggle the visibility of the Dynamic Table Side Pane
function toggleDynamicTableSidePane() {
  const sidePane = document.getElementById("dynamicTableSidePane");

  // Check if the pane is already shown
  if (sidePane.classList.contains("show")) {
    sidePane.classList.remove("show"); // Hide the pane
    document.removeEventListener("click", closeOnClickOutsideDynamicTable);
  } else {
    sidePane.classList.add("show"); // Show the pane
    setTimeout(() => {
      document.addEventListener("click", closeOnClickOutsideDynamicTable);
    }, 0); // Delay to prevent immediate closure
  }
}

// Function to close the pane when clicking outside of it
function closeOnClickOutsideDynamicTable(event) {
  const sidePane = document.getElementById("dynamicTableSidePane");
  if (sidePane && !sidePane.contains(event.target)) {
    sidePane.classList.remove("show");
    document.removeEventListener("click", closeOnClickOutsideDynamicTable);
  }
}

var tablinks = document.getElementsByClassName("tablinks");
var tabcontents = document.getElementsByClassName("tabcontents");
function opentab(tabname) {
  for (let tablink of tablinks) {
    tablink.classList.remove("activelink");
  }
  for (let tabcontent of tabcontents) {
    tabcontent.classList.remove("activetab");
  }
  event.currentTarget.classList.add("activelink");
  document.getElementById(tabname).classList.add("activetab");
}

function preview_togglepopup() {
  let previewPopup = document.getElementById("preview-popup");
  let generateButton = document.getElementById("generate-report");
  let preview = document.getElementById("preview");

  document.getElementById("preview-popup").classList.toggle("active");
  previewPopup.classList.add("active");
  document.body.classList.add("no-scroll");
  window.scrollTo(0, 0); // Scroll to top
  generateButton.style.display = "none";
  // preview.style.overflow='hidden'
}

// document.getElementById("cancel-button").addEventListener("click", function () {
//   let previewPopup = document.getElementById("preview-popup");
//   // let generateButton=document.getElementById("generate-report");
//   document.getElementById("preview-popup").classList.toggle("active");
//   previewPopup.classList.remove("active");
//   let generateButton = document.getElementById("generate-report");
//   generateButton.style.display = "block";
// });

function openOutlookCompose() {
  const outlookURL =
    "https://outlook.live.com/mail/0/deeplink/compose?subject=Japanese%20Language%20Training%20Report&body=Please%20find%20the%20training%20report%20below.";

  // Use window.location to navigate to the URL directly (no pop-up)
  window.location.href = outlookURL;
}

let images = document.querySelectorAll(".image-container img");
let templates = document.querySelectorAll(".workspace > div");
let selectTemplate;

function hideAllTemplates() {
  templates.forEach((template) => {
    template.style.display = "none";
  });
}

images.forEach((image) => {
  image.addEventListener("click", function () {
    hideAllTemplates();
    const templateKey = this.getAttribute("data-template");
    // selectTemplate = this.getAttribute('data-template');
    // console.log(templateKey);
    selectTemplate = templateKey;

    const selectedTemplate = document.getElementById(templateKey);
    if (selectedTemplate) {
      if (templateKey === "template1") {
        console.log("selected template susccessfully")
      }
      if (templateKey === "template2") {
        console.log("selected template susccessfully")
      }
      if (templateKey === "template3") {
        console.log("selected template susccessfully")
      }
      if (templateKey === "template4") {
        console.log("selected template susccessfully")
      }

      selectedTemplate.style.display = "block";
    }
    
  });
});

let downloadButton = document.getElementById("download-button");
let cutAndDownload = document.getElementById("cut-and-download");

let downloadSelect = document.getElementById("downloadSelect");

downloadButton.addEventListener("click", () => {
  let selectedValue = downloadSelect.value;

  if (selectedValue === "") {
    errorMessage();
  } else if (selectedValue === "pdf") {
    downloadPDF();
  } else if (selectedValue === "jpg") {
    downloadJPG();
  } else if (selectedValue === "png") {
    downloadPNG();
  }
});

cutAndDownload.addEventListener("click", () => {
  let selectedValue = downloadSelect.value;

  if (selectedValue === "jpg") {
    CutAndDownloadJPG();
  } else if (selectedValue === "png") {
    CutAndDownloadPNG();
  } else {
    errorMessage();
  }
});

function errorMessage() {
  // alert("Please select a file format before downloading.");
  showAlert("Please select a file format before downloading.");
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;

  // Get the content div dimensions
  const content = document.getElementById(selectTemplate);
  const width = content.offsetWidth; // Width of the div
  const height = content.offsetHeight; // Height of the div

  // Create PDF with custom dimensions
  const pdf = new jsPDF({
    orientation: "portrait", // or 'landscape'
    unit: "px", // Use pixels for dimensions
    format: [width, height], // Set format to the div's width and height
    putOnlyUsedFonts: true,
    floatPrecision: 16, // Precision of float numbers
  });

  html2canvas(content).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, width, height); // Adjusted to use div dimensions
    pdf.save("output.pdf");
  });
}

function CutAndDownloadJPG() {
  if (typeof html2canvas !== "function") {
    console.error("html2canvas not loaded");
    // alert('Failed to capture image: Required library not loaded');
    showAlert("Failed to capture image: Required library not loaded");
    return;
  }

  let break_point1, break_point2;
  if (selectTemplate == "template2") {
    break_point1 = "batch-info";
    break_point2 = "tablecontainer2";
  } else if (selectTemplate == "template5") {
    break_point1 = "batch-info-template5";
    break_point2 = "tablecontainer5";
  } else if (selectTemplate == "template3") {
    break_point1 = "t3batchname";
    break_point2 = "tablecontainer3";
  } else if (selectTemplate == "custom-div") {
    break_point1 = "batch-info-custom";
    break_point2 = "tablecontainer-custom";
  } else if (selectTemplate == "custom-template-user") {
    break_point1 = "batch-info-custom-user";
    break_point2 = "tablecontainer-custom-user";
  }

  const element = document.getElementById(selectTemplate);
  if (!element) {
    console.error("Target element not found:", selectTemplate);
    // alert('Failed to capture image: Target element not found');
    showAlert("Failed to capture image: Target element not found");
    return;
  }

  // **Get actual dimensions to avoid distortion**
  const elementRect = element.getBoundingClientRect();
  const actualWidth = elementRect.width;
  const actualHeight = elementRect.height;

  // **Maintain High-Quality Scaling**
  const publisherDPI = 600; // Standard print quality DPI
  const screenDPI = 96; // Standard screen DPI
  const scaleFactor = publisherDPI / screenDPI;

  // **Output dimensions**
  const outputWidth = Math.round(actualWidth * scaleFactor);
  const outputHeight = Math.round(actualHeight * scaleFactor);

  // **HTML2Canvas Configuration**
  const config = {
    scale: scaleFactor,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    width: actualWidth,
    height: actualHeight,
    scrollX: 0,
    scrollY: 0,
    imageTimeout: 60000,
    logging: false,
    removeContainer: true,
    foreignObjectRendering: false,
    windowHeight: actualHeight,
    onclone: function (clonedDoc) {
      const clonedElement = clonedDoc.getElementById(selectTemplate);
      if (clonedElement) {
        clonedElement.style.height = actualHeight + "px";
        clonedElement.style.overflow = "visible";
      }
    },
  };

  // **Preload all images and fonts**
  const preloadResources = () => {
    return Promise.all([
      document.fonts.ready,
      ...Array.from(element.getElementsByTagName("img")).map((img) => {
        return new Promise((resolve, reject) => {
          if (img.complete) resolve();
          else {
            img.onload = resolve;
            img.onerror = reject;
          }
        });
      }),
    ]);
  };

  // **Process captured canvas with high-quality settings**
  const processCanvas = (canvas, startY, endY) => {
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = outputWidth;
    finalCanvas.height = endY - startY;

    const ctx = finalCanvas.getContext("2d", { alpha: false });

    // **Apply High-Quality Image Processing**
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.globalCompositeOperation = "source-over";

    // **Ensure clean background**
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // **Draw image with proper scaling**
    ctx.drawImage(
      canvas,
      0,
      startY,
      canvas.width,
      finalCanvas.height,
      0,
      0,
      finalCanvas.width,
      finalCanvas.height
    );

    return finalCanvas;
  };

  // **Split Handling for Template 3**
  const splitOffset = selectTemplate == "template3" ? 205 : 175;

  // **Show Loading Indicator**
  const loadingDiv = document.createElement("div");
  loadingDiv.textContent = "Processing JPG...";
  loadingDiv.style.position = "fixed";
  loadingDiv.style.top = "20px";
  loadingDiv.style.right = "20px";
  loadingDiv.style.padding = "12px 20px";
  loadingDiv.style.background = "#f0f0f0"; // Light gray background
  loadingDiv.style.color = "#333"; // Dark text for contrast
  loadingDiv.style.fontSize = "14px";
  loadingDiv.style.fontWeight = "bold";
  loadingDiv.style.borderRadius = "8px";
  loadingDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  loadingDiv.style.zIndex = "1000";
  loadingDiv.style.display = "flex";
  loadingDiv.style.alignItems = "center";
  loadingDiv.style.gap = "8px";

  const spinner = document.createElement("div");
  spinner.style.width = "16px";
  spinner.style.height = "16px";
  spinner.style.border = "3px solid rgba(220, 20, 60, 0.3)"; // Crimson border with transparency
  spinner.style.borderTop = "3px solid #dc143c"; // Crimson highlight
  spinner.style.borderRadius = "50%";
  spinner.style.animation = "spin 1s linear infinite";
  loadingDiv.appendChild(spinner);

  document.body.appendChild(loadingDiv);

  // Add CSS for spinner animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;
  document.head.appendChild(styleSheet);

  preloadResources()
    .then(() => html2canvas(element, config))
    .then((canvas) => {
      const breakPoint1 = Array.from(
        element.getElementsByClassName(break_point1)
      );
      let breakPoints2 = Array.from(
        element.getElementsByClassName(break_point2)
      );
      let splitPoints = [];

      // **Start from the top of the image**
      splitPoints.push(0);

      // **Add breakpoints for `break_point1`**
      breakPoint1.forEach((div) => {
        const divTop = div.offsetTop * scaleFactor;
        splitPoints.push(divTop - splitOffset * scaleFactor);
      });

      breakPoints2 = breakPoints2.filter((div) => {
        // Check if the div has one child
        if (div.children.length === 1) {
          const child = div.children[0]; // Get the first (and only) child
          // Check if the child has any text or other elements inside it
          return child.innerText.trim() !== "" || child.children.length > 0;
        }
        return false;
      });

      // **If there are any non-empty `breakPoint2` divs**
      if (breakPoints2.length > 0) {
        breakPoints2.forEach((div) => {
          const divTop = div.offsetTop * scaleFactor;
          splitPoints.push(divTop - splitOffset * scaleFactor); // Slice at break_point2 div start
        });
        // Ensure slicing goes until the full image height
        splitPoints.push(canvas.height);
      } else {
        // **If `break_point2` is empty, just capture the full content**
        splitPoints.push(canvas.height);
      }

      // **Generate multiple PNG images**
      let part = 1;
      for (let i = 0; i < splitPoints.length - 1; i++) {
        const startY = splitPoints[i];
        const endY = splitPoints[i + 1];

        // **Process canvas for high-quality PNG**
        const finalCanvas = processCanvas(canvas, startY, endY);

        // **Convert to PNG and force download**
        const imgData = finalCanvas.toDataURL("image/jpg", 1.0);
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        link.href = imgData;
        link.download = `Japanese-Training-Report-part-${part}-${timestamp}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        part++;
      }

      // **Remove Loading Indicator**
      document.body.removeChild(loadingDiv);
    })
    .catch((error) => {
      console.error("Error generating high-quality PNG:", error);
      // alert('Failed to capture image. Please try again.');
      showAlert("Failed to capture image. Please try again.");
      document.body.removeChild(loadingDiv);
    });
}

function CutAndDownloadPNG() {
  if (typeof html2canvas !== "function") {
    console.error("html2canvas not loaded");
    // alert('Failed to capture image: Required library not loaded');
    showAlert("Failed to capture image: Required library not loaded");
    return;
  }

  let break_point1, break_point2;
  if (selectTemplate == "template2") {
    break_point1 = "batch-info";
    break_point2 = "tablecontainer2";
  } else if (selectTemplate == "template5") {
    break_point1 = "batch-info-template5";
    break_point2 = "tablecontainer4";
  } else if (selectTemplate == "template3") {
    break_point1 = "t3batchname";
    break_point2 = "tablecontainer3";
  } else if (selectTemplate == "custom-div") {
    break_point1 = "batch-info-custom";
    break_point2 = "tablecontainer-custom";
  }

  const element = document.getElementById(selectTemplate);
  if (!element) {
    console.error("Target element not found:", selectTemplate);
    // alert('Failed to capture image: Target element not found');
    showAlert("Failed to capture image: Target element not found");
    return;
  }

  // **Get actual dimensions to avoid distortion**
  const elementRect = element.getBoundingClientRect();
  const actualWidth = elementRect.width;
  const actualHeight = elementRect.height;

  // **Maintain High-Quality Scaling**
  const publisherDPI = 600; // Standard print quality DPI
  const screenDPI = 96; // Standard screen DPI
  const scaleFactor = publisherDPI / screenDPI;

  // **Output dimensions**
  const outputWidth = Math.round(actualWidth * scaleFactor);
  const outputHeight = Math.round(actualHeight * scaleFactor);

  // **HTML2Canvas Configuration**
  const config = {
    scale: scaleFactor,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    width: actualWidth,
    height: actualHeight,
    scrollX: 0,
    scrollY: 0,
    imageTimeout: 60000,
    logging: false,
    removeContainer: true,
    foreignObjectRendering: false,
    windowHeight: actualHeight,
    onclone: function (clonedDoc) {
      const clonedElement = clonedDoc.getElementById(selectTemplate);
      if (clonedElement) {
        clonedElement.style.height = actualHeight + "px";
        clonedElement.style.overflow = "visible";
      }
    },
  };

  // **Preload all images and fonts**
  const preloadResources = () => {
    return Promise.all([
      document.fonts.ready,
      ...Array.from(element.getElementsByTagName("img")).map((img) => {
        return new Promise((resolve, reject) => {
          if (img.complete) resolve();
          else {
            img.onload = resolve;
            img.onerror = reject;
          }
        });
      }),
    ]);
  };

  // **Process captured canvas with high-quality settings**
  const processCanvas = (canvas, startY, endY) => {
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = outputWidth;
    finalCanvas.height = endY - startY;

    const ctx = finalCanvas.getContext("2d", { alpha: false });

    // **Apply High-Quality Image Processing**
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.globalCompositeOperation = "source-over";

    // **Ensure clean background**
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // **Draw image with proper scaling**
    ctx.drawImage(
      canvas,
      0,
      startY,
      canvas.width,
      finalCanvas.height,
      0,
      0,
      finalCanvas.width,
      finalCanvas.height
    );

    return finalCanvas;
  };

  // **Split Handling for Template 3**
  const splitOffset = selectTemplate == "template3" ? 205 : 175;

  // **Show Loading Indicator**
  const loadingDiv = document.createElement("div");
  loadingDiv.textContent = "Processing PNG...";
  loadingDiv.style.position = "fixed";
  loadingDiv.style.top = "20px";
  loadingDiv.style.right = "20px";
  loadingDiv.style.padding = "12px 20px";
  loadingDiv.style.background = "#f0f0f0"; // Light gray background
  loadingDiv.style.color = "#333"; // Dark text for contrast
  loadingDiv.style.fontSize = "14px";
  loadingDiv.style.fontWeight = "bold";
  loadingDiv.style.borderRadius = "8px";
  loadingDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  loadingDiv.style.zIndex = "1000";
  loadingDiv.style.display = "flex";
  loadingDiv.style.alignItems = "center";
  loadingDiv.style.gap = "8px";

  const spinner = document.createElement("div");
  spinner.style.width = "16px";
  spinner.style.height = "16px";
  spinner.style.border = "3px solid rgba(220, 20, 60, 0.3)"; // Crimson border with transparency
  spinner.style.borderTop = "3px solid #dc143c"; // Crimson highlight
  spinner.style.borderRadius = "50%";
  spinner.style.animation = "spin 1s linear infinite";
  loadingDiv.appendChild(spinner);

  document.body.appendChild(loadingDiv);

  // Add CSS for spinner animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;
  document.head.appendChild(styleSheet);

  preloadResources()
    .then(() => html2canvas(element, config))
    .then((canvas) => {
      const breakPoint1 = Array.from(
        element.getElementsByClassName(break_point1)
      );
      let breakPoints2 = Array.from(
        element.getElementsByClassName(break_point2)
      );
      let splitPoints = [];

      // **Start from the top of the image**
      splitPoints.push(0);

      // **Add breakpoints for `break_point1`**
      breakPoint1.forEach((div) => {
        const divTop = div.offsetTop * scaleFactor;
        splitPoints.push(divTop - splitOffset * scaleFactor);
      });

      breakPoints2 = breakPoints2.filter((div) => {
        // Check if the div has one child
        if (div.children.length === 1) {
          const child = div.children[0]; // Get the first (and only) child
          // Check if the child has any text or other elements inside it
          return child.innerText.trim() !== "" || child.children.length > 0;
        }
        return false;
      });

      // **If there are any non-empty `breakPoint2` divs**
      if (breakPoints2.length > 0) {
        breakPoints2.forEach((div) => {
          const divTop = div.offsetTop * scaleFactor;
          splitPoints.push(divTop - splitOffset * scaleFactor); // Slice at break_point2 div start
        });
        // Ensure slicing goes until the full image height
        splitPoints.push(canvas.height);
      } else {
        // **If `break_point2` is empty, just capture the full content**
        splitPoints.push(canvas.height);
      }

      // **Generate multiple PNG images**
      let part = 1;
      for (let i = 0; i < splitPoints.length - 1; i++) {
        const startY = splitPoints[i];
        const endY = splitPoints[i + 1];

        // **Process canvas for high-quality PNG**
        const finalCanvas = processCanvas(canvas, startY, endY);

        // **Convert to PNG and force download**
        const imgData = finalCanvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        link.href = imgData;
        link.download = `Japanese-Training-Report-part-${part}-${timestamp}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        part++;
      }

      // **Remove Loading Indicator**
      document.body.removeChild(loadingDiv);
    })
    .catch((error) => {
      console.error("Error generating high-quality PNG:", error);
      // alert('Failed to capture image. Please try again.');
      showAlert("Failed to capture image. Please try again.");
      document.body.removeChild(loadingDiv);
    });
}

function downloadJPG() {
  if (typeof html2canvas !== "function") {
    console.error("html2canvas not loaded");
    // alert('Failed to capture image: Required library not loaded');
    showAlert("Failed to capture image: Required library not loaded");
    return;
  }

  const element = document.getElementById(selectTemplate);
  if (!element) {
    console.error("Target element not found:", selectTemplate);
    // alert('Failed to capture image: Target element not found');
    showAlert("Failed to capture image: Target element not found");
    return;
  }

  // Get actual element dimensions
  const elementRect = element.getBoundingClientRect();
  const actualWidth = elementRect.width;
  const actualHeight = elementRect.height;

  // Calculate dimensions while maintaining quality
  const publisherDPI = 300; // Standard print quality DPI
  const screenDPI = 96; // Standard screen DPI
  const scaleFactor = publisherDPI / screenDPI;

  // Dynamic dimensions calculation
  // We'll use the actual dimensions and scale them up to maintain quality
  const outputWidth = Math.round(actualWidth * scaleFactor);
  const outputHeight = Math.round(actualHeight * scaleFactor);

  const config = {
    scale: scaleFactor,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    width: actualWidth,
    height: actualHeight,
    scrollX: 0,
    scrollY: 0,
    imageTimeout: 60000,
    logging: false,
    removeContainer: true,
    foreignObjectRendering: false,
    // Capture the full element height
    windowHeight: actualHeight,
    // Ensure we capture everything
    onclone: function (clonedDoc) {
      const clonedElement = clonedDoc.getElementById(selectTemplate);
      if (clonedElement) {
        clonedElement.style.height = actualHeight + "px";
        clonedElement.style.overflow = "visible";
      }
    },
  };

  // Pre-load all resources
  const preloadResources = () => {
    return Promise.all([
      document.fonts.ready,
      ...Array.from(element.getElementsByTagName("img")).map((img) => {
        return new Promise((resolve, reject) => {
          if (img.complete) resolve();
          else {
            img.onload = resolve;
            img.onerror = reject;
          }
        });
      }),
    ]);
  };

  // Process canvas with dynamic dimensions
  const processCanvas = (canvas) => {
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = outputWidth;
    finalCanvas.height = outputHeight;
    const ctx = finalCanvas.getContext("2d", { alpha: false });

    // Apply high-quality image processing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.globalCompositeOperation = "source-over";

    // Ensure clean background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // Draw with high-quality interpolation
    ctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);

    return finalCanvas;
  };

  // Add loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.textContent = "Processing JPG...";
  loadingDiv.style.position = "fixed";
  loadingDiv.style.top = "20px";
  loadingDiv.style.right = "20px";
  loadingDiv.style.padding = "12px 20px";
  loadingDiv.style.background = "#f0f0f0"; // Light gray background
  loadingDiv.style.color = "#333"; // Dark text for contrast
  loadingDiv.style.fontSize = "14px";
  loadingDiv.style.fontWeight = "bold";
  loadingDiv.style.borderRadius = "8px";
  loadingDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  loadingDiv.style.zIndex = "1000";
  loadingDiv.style.display = "flex";
  loadingDiv.style.alignItems = "center";
  loadingDiv.style.gap = "8px";

  const spinner = document.createElement("div");
  spinner.style.width = "16px";
  spinner.style.height = "16px";
  spinner.style.border = "3px solid rgba(220, 20, 60, 0.3)"; // Crimson border with transparency
  spinner.style.borderTop = "3px solid #dc143c"; // Crimson highlight
  spinner.style.borderRadius = "50%";
  spinner.style.animation = "spin 1s linear infinite";
  loadingDiv.appendChild(spinner);

  document.body.appendChild(loadingDiv);

  // Add CSS for spinner animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;
  document.head.appendChild(styleSheet);

  // Execute the export
  preloadResources()
    .then(() => html2canvas(element, config))
    .then((canvas) => processCanvas(canvas))
    .then((finalCanvas) => {
      // Use maximum quality JPEG encoding
      const imgData = finalCanvas.toDataURL("image/jpeg", 1.0);

      // Force download with correct filename
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.href = imgData;
      link.download = `Japanese-Training-Report-${timestamp}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Remove loading indicator
      document.body.removeChild(loadingDiv);
    })
    .catch((error) => {
      console.error("Error generating high-quality image:", error);
      // alert('Failed to capture image. Please try again.');
      showAlert("Failed to capture image. Please try again.");
      // Remove loading indicator on error
      document.body.removeChild(loadingDiv);
    });
}

function downloadPNG() {
  console.log("selecteddddddddddd", selectTemplate);

  if (typeof html2canvas !== "function") {
    console.error("html2canvas not loaded");
    // alert('Failed to capture image: Required library not loaded');
    showAlert("Failed to capture image: Required library not loaded");
    return;
  }

  const element = document.getElementById(selectTemplate);
  if (!element) {
    console.error("Target element not found:", selectTemplate);
    // alert('Failed to capture image: Target element not found');
    showAlert("Failed to capture image: Target element not found");
    return;
  }

  // Get actual element dimensions
  const elementRect = element.getBoundingClientRect();
  const actualWidth = elementRect.width;
  const actualHeight = elementRect.height;

  // Calculate dimensions while maintaining quality
  const publisherDPI = 300; // Standard print quality DPI
  const screenDPI = 96; // Standard screen DPI
  const scaleFactor = publisherDPI / screenDPI;

  // Dynamic dimensions calculation
  // We'll use the actual dimensions and scale them up to maintain quality
  const outputWidth = Math.round(actualWidth * scaleFactor);
  const outputHeight = Math.round(actualHeight * scaleFactor);

  const config = {
    scale: scaleFactor,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    width: actualWidth,
    height: actualHeight,
    scrollX: 0,
    scrollY: 0,
    imageTimeout: 60000,
    logging: false,
    removeContainer: true,
    foreignObjectRendering: false,
    // Capture the full element height
    windowHeight: actualHeight,
    // Ensure we capture everything
    onclone: function (clonedDoc) {
      const clonedElement = clonedDoc.getElementById(selectTemplate);
      if (clonedElement) {
        clonedElement.style.height = actualHeight + "px";
        clonedElement.style.overflow = "visible";
      }
    },
  };

  // Pre-load all resources
  const preloadResources = () => {
    return Promise.all([
      document.fonts.ready,
      ...Array.from(element.getElementsByTagName("img")).map((img) => {
        return new Promise((resolve, reject) => {
          if (img.complete) resolve();
          else {
            img.onload = resolve;
            img.onerror = reject;
          }
        });
      }),
    ]);
  };

  // Process canvas with dynamic dimensions
  const processCanvas = (canvas) => {
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = outputWidth;
    finalCanvas.height = outputHeight;
    const ctx = finalCanvas.getContext("2d", { alpha: false });

    // Apply high-quality image processing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.globalCompositeOperation = "source-over";

    // Ensure clean background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // Draw with high-quality interpolation
    ctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);

    return finalCanvas;
  };

  // Add loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.textContent = "Processing PNG...";
  loadingDiv.style.position = "fixed";
  loadingDiv.style.top = "20px";
  loadingDiv.style.right = "20px";
  loadingDiv.style.padding = "12px 20px";
  loadingDiv.style.background = "#f0f0f0"; // Light gray background
  loadingDiv.style.color = "#333"; // Dark text for contrast
  loadingDiv.style.fontSize = "14px";
  loadingDiv.style.fontWeight = "bold";
  loadingDiv.style.borderRadius = "8px";
  loadingDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  loadingDiv.style.zIndex = "1000";
  loadingDiv.style.display = "flex";
  loadingDiv.style.alignItems = "center";
  loadingDiv.style.gap = "8px";

  const spinner = document.createElement("div");
  spinner.style.width = "16px";
  spinner.style.height = "16px";
  spinner.style.border = "3px solid rgba(220, 20, 60, 0.3)"; // Crimson border with transparency
  spinner.style.borderTop = "3px solid #dc143c"; // Crimson highlight
  spinner.style.borderRadius = "50%";
  spinner.style.animation = "spin 1s linear infinite";
  loadingDiv.appendChild(spinner);

  document.body.appendChild(loadingDiv);

  // Add CSS for spinner animation
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;
  document.head.appendChild(styleSheet);

  // Execute the export
  preloadResources()
    .then(() => html2canvas(element, config))
    .then((canvas) => processCanvas(canvas))
    .then((finalCanvas) => {
      // Use maximum quality JPEG encoding
      const imgData = finalCanvas.toDataURL("image/png", 1.0);

      // Force download with correct filename
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.href = imgData;
      link.download = `Japanese-Training-Report-${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Remove loading indicator
      document.body.removeChild(loadingDiv);
    })
    .catch((error) => {
      console.error("Error generating high-quality image:", error);
      // alert('Failed to capture image. Please try again.');
      showAlert("Failed to capture image. Please try again.");
      // Remove loading indicator on error
      document.body.removeChild(loadingDiv);
    });
}

function downloadHTML() {
  const imageUrl =
    "https://experiontechnologies-my.sharepoint.com/:i:/r/personal/hisham_e_experionglobal_com/Documents/JapaneseReport/Japanese-Training-Report-2025-03-12T08-02-36-293Z.jpg?csf=1&web=1&e=2ZVLQK";
  // Validate input
  if (!imageUrl || typeof imageUrl !== "string") {
    console.error("Invalid image URL provided");
    // alert('Failed to generate HTML: Invalid image URL');
    showAlert("Failed to generate HTML: Invalid image URL");
    return;
  }

  // Create the HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* Ensure the table takes full width and no padding/margin */
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden; /* Prevent horizontal scrolling */
        }
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        img {
          width: 100%; /* Image width matches the email body */
          height: auto; /* Maintain aspect ratio */
          display: block; /* Remove any extra space below the image */
        }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td>
            <!-- The image will be displayed here -->
            <img src="${imageUrl}" alt="Generated Image">
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Create a Blob from the HTML content
  const blob = new Blob([htmlContent], { type: "text/html" });

  // Create a temporary anchor element for downloading
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = URL.createObjectURL(blob);
  link.download = `Japanese-Training-Report-${timestamp}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL
  URL.revokeObjectURL(link.href);
}

downloadButton.addEventListener("click", () => {
  if (downloadSelect.value === "") {
    // alert("Please select a format before downloading.");
    showAlert("Please select a format before downloading.");
  }
});

// });

let tableContainer;
let tableId;
let toolbarId;
let mergeRowIndex;
let startColumnIndex;
let endColumnIndex;
let mergeColIndex;
let startrowIndex;
let endrowIndex;
let toolbar_text;
let textColorPicker;
let highlightColorPicker;
let imageToolbar;
let hideImage;
let borderColorPicker = null;
images.forEach((image) => {
  image.addEventListener("click", function () {
    hideAllTemplates();
    const templateKey = this.getAttribute("data-template");
    // selectTemplate = this.getAttribute('data-template');
    // console.log(templateKey);
    selectTemplate = templateKey;

    const selectedTemplate = document.getElementById(templateKey);
    if (selectedTemplate) {
      if (templateKey === "template2") {
        toolbarId = "toolbar";
        mergeRowIndex = "mergeRowIndex";
        startColumnIndex = "startColumnIndex";
        endColumnIndex = "endColumnIndex";
        mergeColIndex = "mergeColIndex";
        startrowIndex = "startRowIndex";
        endrowIndex = "endRowIndex";
        toolbar_text = "toolbar-text";
        textColorPicker = "textColorPicker";
        highlightColorPicker = "highlightColorPicker";
        imageToolbar = "imageToolbar";
        hideImage = "#tableContent img";
        borderColorPicker = "borderColorPicker";

        let addButton = document.getElementById("addtablesection");
        let addSelect = document.getElementById("tableSectionPreference");
        addButton.addEventListener("click", () => {
          let selectedValue = addSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById("tableContentAbove2");
            tableId = "tablecontainerAbove2";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent2");
            tableId = "tablecontainer2";
          }
        });

        let addTextButton = document.getElementById("addTextForTableSpace");
        let addTextSelect = document.getElementById("tableSectionPreference");
        addTextButton.addEventListener("click", () => {
          let selectedValue = addTextSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById("tableContentAbove2");
            tableId = "tablecontainerAbove2";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent2");
            tableId = "tablecontainer2";
          }
        });

        let addImageButton = document.getElementById("addImageToTableSection");
        let addImageSelect = document.getElementById("tableSectionPreference");
        addImageButton.addEventListener("click", () => {
          let selectedValue = addImageSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById("tableContentAbove2");
            tableId = "tablecontainerAbove2";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent2");
            tableId = "tablecontainer2";
          }
        });
      } else if (templateKey === "template5") {
        // tableContainer = document.getElementById('tableContent5')
        // tableId = 'tablecontainer5'
        toolbarId = "toolbar";
        mergeRowIndex = "mergeRowIndex";
        startColumnIndex = "startColumnIndex";
        endColumnIndex = "endColumnIndex";
        mergeColIndex = "mergeColIndex";
        startrowIndex = "startRowIndex";
        endrowIndex = "endRowIndex";
        toolbar_text = "toolbar-text";
        textColorPicker = "textColorPicker";
        highlightColorPicker = "highlightColorPicker";
        imageToolbar = "imageToolbar";
        hideImage = "#tableContent img";
        borderColorPicker = "borderColorPicker";

        let addButton = document.getElementById("addtablesection");
        let addSelect = document.getElementById("tableSectionPreference");
        addButton.addEventListener("click", () => {
          let selectedValue = addSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById("tableContentAbove5");
            tableId = "tablecontainerAbove5";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent5");
            tableId = "tablecontainer5";
          }
        });

        let addTextButton = document.getElementById("addTextForTableSpace");
        let addTextSelect = document.getElementById("tableSectionPreference");
        addTextButton.addEventListener("click", () => {
          let selectedValue = addTextSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById("tableContentAbove5");
            tableId = "tablecontainerAbove5";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent5");
            tableId = "tablecontainer5";
          }
        });

        let addImageButton = document.getElementById("addImageToTableSection");
        let addImageSelect = document.getElementById("tableSectionPreference");
        addImageButton.addEventListener("click", () => {
          let selectedValue = addImageSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById("tableContentAbove5");
            tableId = "tablecontainerAbove5";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent5");
            tableId = "tablecontainer5";
          }
        });
      } else if (templateKey === "custom-div") {
        // tableContainer = document.getElementById('tableContent-custom')
        // tableId = 'tablecontainer-custom'
        toolbarId = "toolbar";
        mergeRowIndex = "mergeRowIndex";
        startColumnIndex = "startColumnIndex";
        endColumnIndex = "endColumnIndex";
        mergeColIndex = "mergeColIndex";
        startrowIndex = "startRowIndex";
        endrowIndex = "endRowIndex";
        toolbar_text = "toolbar-text";
        textColorPicker = "textColorPicker";
        highlightColorPicker = "highlightColorPicker";
        imageToolbar = "imageToolbar";
        hideImage = "#tableContent img";
        borderColorPicker = "borderColorPicker";

        let addButton = document.getElementById("addtablesection");
        let addSelect = document.getElementById("tableSectionPreference");
        addButton.addEventListener("click", () => {
          let selectedValue = addSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById(
              "tableContentAbove-custom"
            );
            tableId = "tablecontainerAbove-custom";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent-custom");
            tableId = "tablecontainer-custom";
          }
        });

        let addTextButton = document.getElementById("addTextForTableSpace");
        let addTextSelect = document.getElementById("tableSectionPreference");
        addTextButton.addEventListener("click", () => {
          let selectedValue = addTextSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById(
              "tableContentAbove-custom"
            );
            tableId = "tablecontainerAbove-custom";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent-custom");
            tableId = "tablecontainer-custom";
          }
        });

        let addImageButton = document.getElementById("addImageToTableSection");
        let addImageSelect = document.getElementById("tableSectionPreference");
        addImageButton.addEventListener("click", () => {
          let selectedValue = addImageSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById(
              "tableContentAbove-custom"
            );
            tableId = "tablecontainerAbove-custom";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent-custom");
            tableId = "tablecontainer-custom";
          }
        });
      } else if (templateKey === "template3") {
        // tableContainer = document.getElementById('tableContent3')
        // tableId = 'tablecontainer3'
        toolbarId = "toolbar";
        mergeRowIndex = "mergeRowIndex";
        startColumnIndex = "startColumnIndex";
        endColumnIndex = "endColumnIndex";
        mergeColIndex = "mergeColIndex";
        startrowIndex = "startRowIndex";
        endrowIndex = "endRowIndex";
        toolbar_text = "toolbar-text";
        textColorPicker = "textColorPicker";
        highlightColorPicker = "highlightColorPicker";
        imageToolbar = "imageToolbar";
        hideImage = "#tableContent img";
        borderColorPicker = "borderColorPicker";

        let addButton = document.getElementById("addtablesection");
        let addSelect = document.getElementById("tableSectionPreference");
        addButton.addEventListener("click", () => {
          let selectedValue = addSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById("tableContentAbove3");
            tableId = "tablecontainerAbove3";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent3");
            tableId = "tablecontainer3";
          }
        });

        let addTextButton = document.getElementById("addTextForTableSpace");
        let addTextSelect = document.getElementById("tableSectionPreference");
        addTextButton.addEventListener("click", () => {
          let selectedValue = addTextSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById("tableContentAbove3");
            tableId = "tablecontainerAbove3";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent3");
            tableId = "tablecontainer3";
          }
        });

        let addImageButton = document.getElementById("addImageToTableSection");
        let addImageSelect = document.getElementById("tableSectionPreference");
        addImageButton.addEventListener("click", () => {
          let selectedValue = addImageSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById("tableContentAbove3");
            tableId = "tablecontainerAbove3";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent3");
            tableId = "tablecontainer3";
          }
        });
      } else if (templateKey === "custom-template-user") {
        // tableContainer = document.getElementById('tableContent-custom-user')
        // tableId = 'tablecontainer-custom-user'
        toolbarId = "toolbar";
        mergeRowIndex = "mergeRowIndex";
        startColumnIndex = "startColumnIndex";
        endColumnIndex = "endColumnIndex";
        mergeColIndex = "mergeColIndex";
        startrowIndex = "startRowIndex";
        endrowIndex = "endRowIndex";
        toolbar_text = "toolbar-text";
        textColorPicker = "textColorPicker";
        highlightColorPicker = "highlightColorPicker";
        imageToolbar = "imageToolbar";
        hideImage = "#tableContent img";
        borderColorPicker = "borderColorPicker";

        let addButton = document.getElementById("addtablesection");
        let addSelect = document.getElementById("tableSectionPreference");
        addButton.addEventListener("click", () => {
          let selectedValue = addSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById(
              "tableContent-customAbove-user"
            );
            tableId = "tablecontainer-customAbove-user";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById(
              "tableContent-custom-user"
            );
            tableId = "tablecontainer-custom-user";
          }
        });

        let addTextButton = document.getElementById("addTextForTableSpace");
        let addTextSelect = document.getElementById("tableSectionPreference");
        addTextButton.addEventListener("click", () => {
          let selectedValue = addTextSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById(
              "tableContent-customAbove-user"
            );
            tableId = "tablecontainer-customAbove-user";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById(
              "tableContent-custom-user"
            );
            tableId = "tablecontainer-custom-user";
          }
        });

        let addImageButton = document.getElementById("addImageToTableSection");
        let addImageSelect = document.getElementById("tableSectionPreference");
        addImageButton.addEventListener("click", () => {
          let selectedValue = addImageSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById(
              "tableContent-customAbove-user"
            );
            tableId = "tablecontainer-customAbove-user";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById(
              "tableContent-custom-user"
            );
            tableId = "tablecontainer-custom-user";
          }
        });
      } else {
        // tableContainer = document.getElementById('tableContent1')
        // tableId = 'tablecontainer1'
        toolbarId = "toolbar";
        mergeRowIndex = "mergeRowIndex";
        startColumnIndex = "startColumnIndex";
        endColumnIndex = "endColumnIndex";
        mergeColIndex = "mergeColIndex";
        startrowIndex = "startRowIndex";
        endrowIndex = "endRowIndex";
        toolbar_text = "toolbar-text";
        textColorPicker = "textColorPicker";
        highlightColorPicker = "highlightColorPicker";
        imageToolbar = "imageToolbar";
        hideImage = "#tableContent img";
        borderColorPicker = "borderColorPicker";

        let addButton = document.getElementById("addtablesection");
        let addSelect = document.getElementById("tableSectionPreference");
        addButton.addEventListener("click", () => {
          let selectedValue = addSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById("tableContentAbove1");
            tableId = "tablecontainerAbove1";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent1");
            tableId = "tablecontainer1";
          }
        });

        let addTextButton = document.getElementById("addTextForTableSpace");
        let addTextSelect = document.getElementById("tableSectionPreference");
        addTextButton.addEventListener("click", () => {
          let selectedValue = addTextSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById("tableContentAbove1");
            tableId = "tablecontainerAbove1";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent1");
            tableId = "tablecontainer1";
          }
        });

        let addImageButton = document.getElementById("addImageToTableSection");
        let addImageSelect = document.getElementById("tableSectionPreference");
        addImageButton.addEventListener("click", () => {
          let selectedValue = addImageSelect.value;
          if (selectedValue == "above") {
            tableContainer = document.getElementById("tableContentAbove1");
            tableId = "tablecontainerAbove1";
          } else if (selectedValue == "below") {
            tableContainer = document.getElementById("tableContent1");
            tableId = "tablecontainer1";
          }
        });
      }
    }
  });
});

const contentDiv = document.getElementById("workspace");

let selectedTable = null; // Track the selected table
let selectedCell = null; // Track the selected cell

function createTable() {
  const rows = parseInt(document.getElementById("rowCount").value);
  const cols = parseInt(document.getElementById("colCount").value);

  const table = document.createElement("table");
  table.className = "custom-table";
  table.style.width = "100%"; // Ensure table fills container
  table.style.borderCollapse = "collapse";
  table.style.tableLayout = "fixed"; // Ensures equal column widths
  table.style.fontSize = "12px";

  for (let i = 0; i < rows; i++) {
    const row = table.insertRow();
    for (let j = 0; j < cols; j++) {
      const cell = row.insertCell();
      cell.contentEditable = true; // Make cell editable
      cell.innerText = `Row ${i + 1}, Col ${j + 1}`;
      cell.onclick = () => selectCell(cell, table); // Set as selected on click
    }
  }

  tableContainer.appendChild(table);
}

// Function to select a cell and set its table as the selectedTable
function selectCell(cell, table) {
  selectedCell = cell;
  selectedTable = table;

  // Display and position the toolbar
  const toolbar = document.getElementById(toolbarId);
  toolbar.style.display = "block";
  const rect = cell.getBoundingClientRect();
  toolbar.style.top = `${rect.top - toolbar.offsetHeight - 5}px`;
  toolbar.style.left = `${rect.left}px`;
}

function makeBold() {
  if (selectedCell) {
    selectedCell.style.fontWeight =
      selectedCell.style.fontWeight === "bold" ? "normal" : "bold";
  }
}

function increaseTextSize() {
  if (selectedCell) {
    const currentSize = window.getComputedStyle(selectedCell).fontSize;
    selectedCell.style.fontSize = `${parseInt(currentSize) + 2}px`;
  }
}

function setTableSpacing() {
  const spacing = parseInt(document.getElementById("tableSpacing").value) || 0;
  const tables = document.querySelectorAll(".custom-table");

  tables.forEach((table, index) => {
    if (index > 0) {
      // Skip the first table to avoid top margin on it
      table.style.marginTop = `${spacing}px`;
    }
  });
}

function decreaseTextSize() {
  if (selectedCell) {
    let currentSize = parseInt(window.getComputedStyle(selectedCell).fontSize);
    if (currentSize > 6) {
      // Prevents text size from becoming too small
      selectedCell.style.fontSize = currentSize - 2 + "px";
    }
  } else {
    // alert('Please select a cell to decrease text size.');
    showAlert("Please select a cell to decrease text size.");
  }
}

function increaseIndent() {
  if (selectedCell) {
    let currentIndent = parseInt(selectedCell.style.paddingLeft) || 0;
    selectedCell.style.paddingLeft = currentIndent + 10 + "px";
  } else {
    // alert('Please select a cell to indent.');
    showAlert("Please select a cell to indent.");
  }
}

function decreaseIndent() {
  if (selectedCell) {
    let currentIndent = parseInt(selectedCell.style.paddingLeft) || 0;
    if (currentIndent > 0) {
      selectedCell.style.paddingLeft = currentIndent - 10 + "px";
    }
  } else {
    // alert('Please select a cell to decrease indent.');
    showAlert("Please select a cell to decrease indent.");
  }
}

function increaseTableSize() {
  if (selectedTable) {
    const cells = selectedTable.getElementsByTagName("td");
    for (let cell of cells) {
      let currentSize = parseInt(window.getComputedStyle(cell).fontSize);
      cell.style.fontSize = currentSize + 2 + "px";
    }
  } else {
    // alert('Please select a table to increase text size.');
    showAlert("Please select a table to increase text size.");
  }
}

function decreaseTableSize() {
  if (selectedTable) {
    const cells = selectedTable.getElementsByTagName("td");
    for (let cell of cells) {
      let currentSize = parseInt(window.getComputedStyle(cell).fontSize);
      if (currentSize > 6) {
        // Prevents text size from becoming too small
        cell.style.fontSize = currentSize - 2 + "px";
      }
    }
  } else {
    // alert('Please select a table to decrease text size.');
    showAlert("Please select a table to decrease text size.");
  }
}

function changeCellBackground() {
  if (selectedCell) {
    // Create a color picker with the last chosen color as the default
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.style.position = "relative";
    colorPicker.style.zIndex = "1000";
    colorPicker.style.opacity = "0";

    // Get the row of the selected cell
    const row = selectedCell;

    // Add event listener to apply color on change
    colorPicker.addEventListener("input", (event) => {
      row.style.backgroundColor = event.target.value; // Change the background color of the entire row
    });

    // Append to body and click to open the picker
    document.body.appendChild(colorPicker);
    colorPicker.click();

    // Remove the color picker after color is selected
    colorPicker.addEventListener("change", () => {
      document.body.removeChild(colorPicker);
    });
  }
}

// let defaultTextColor = '#000000'; // Initial default text color (black)

function changeTextColorTable() {
  if (selectedCell) {
    // Create a color picker with the last chosen color as the default
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.style.position = "absolute";
    colorPicker.style.zIndex = "1000";
    colorPicker.style.opacity = "0";

    // Get the row of the selected cell
    const row = selectedCell;

    // Add event listener to apply color on change
    colorPicker.addEventListener("input", (event) => {
      row.style.color = event.target.value; // Change the text color of the entire row
    });

    // Append to body and click to open the picker
    document.body.appendChild(colorPicker);
    colorPicker.click();

    // Remove the color picker after color is selected
    colorPicker.addEventListener("change", () => {
      document.body.removeChild(colorPicker);
    });
  }
}

function changeRowBackground() {
  if (selectedCell) {
    // Create a color picker with the last chosen color as the default
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.style.position = "absolute";
    colorPicker.style.zIndex = "1000";
    colorPicker.style.opacity = "0";

    // Get the row of the selected cell
    const row = selectedCell.parentElement;

    // Add event listener to apply color on change
    colorPicker.addEventListener("input", (event) => {
      row.style.backgroundColor = event.target.value; // Change the background color of the entire row
    });

    // Append to body and click to open the picker
    document.body.appendChild(colorPicker);
    colorPicker.click();

    // Remove the color picker after color is selected
    colorPicker.addEventListener("change", () => {
      document.body.removeChild(colorPicker);
    });
  }
}

function changeColumnBackground() {
  if (selectedCell) {
    // Create a color picker with the last chosen color as the default
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.style.position = "absolute";
    colorPicker.style.zIndex = "1000";
    colorPicker.style.opacity = "0";

    // Get the column index of the selected cell
    const colIndex = selectedCell.cellIndex;
    const table = selectedCell.closest("table"); // Get the closest table

    // Add event listener to apply color on change
    colorPicker.addEventListener("input", (event) => {
      for (let row of table.rows) {
        row.cells[colIndex].style.backgroundColor = event.target.value; // Change the background color of the entire column
      }
    });

    // Append to body and click to open the picker
    document.body.appendChild(colorPicker);
    colorPicker.click();

    // Remove the color picker after color is selected
    colorPicker.addEventListener("change", () => {
      document.body.removeChild(colorPicker);
    });
  }
}

function mergeRowCells() {
  const rowIndex = parseInt(document.getElementById(mergeRowIndex).value) - 1; // Convert to 0-based index
  const startColIndex =
    parseInt(document.getElementById(startColumnIndex).value) - 1; // Convert to 0-based index
  const endColIndex =
    parseInt(document.getElementById(endColumnIndex).value) - 1; // Convert to 0-based index

  if (
    selectedTable &&
    rowIndex >= 0 &&
    startColIndex >= 0 &&
    endColIndex >= startColIndex
  ) {
    const row = selectedTable.rows[rowIndex];
    if (row) {
      const cellsToMerge = Array.from(row.cells).slice(
        startColIndex,
        endColIndex + 1
      ); // Get the cells to merge

      if (cellsToMerge.length > 1) {
        const mergedText = cellsToMerge.map((c) => c.innerText).join(" "); // Combine text from merged cells
        cellsToMerge[0].colSpan = cellsToMerge.length; // Set colspan for the first cell
        cellsToMerge[0].innerText = mergedText; // Set combined text
        cellsToMerge.slice(1).forEach((c) => {
          c.style.display = "none"; // Hide the merged cells
          c.classList.remove("selected"); // Remove selection from hidden cells
        });
        selectedCells = []; // Clear selected cells after merging
        document.getElementById(toolbarId).style.display = "none"; // Hide toolbar
      }

      document.getElementById(mergeRowIndex).value = "";
      document.getElementById(startColumnIndex).value = "";
      document.getElementById(endColumnIndex).value = "";
    }
  } else {
    // alert("Invalid row or column index");
    showAlert("Invalid row or column index");
  }
}

function toggleTableBorder() {
  if (selectedTable) {
    const isBorderVisible = (selectedTable.style.borderCollapse = "collapse");
    // selectedTable.style.borderCollapse = isBorderVisible ? 'separate' : 'collapse';
    selectedTable.style.border = isBorderVisible
      ? "1px solid #333"
      : "2px solid #333";

    // Optionally, you can also toggle individual cell borders
    const cells = selectedTable.getElementsByTagName("td");
    for (let cell of cells) {
      cell.style.border = isBorderVisible ? "1px solid #333" : "2px solid #333";
    }
  }
  isBorderVisible = "seperate";
}

function mergeColumnCells() {
  const colIndex = parseInt(document.getElementById(mergeColIndex).value) - 1; // Convert to 0-based index
  const startRowIndex =
    parseInt(document.getElementById(startrowIndex).value) - 1; // Convert to 0-based index
  const endRowIndex = parseInt(document.getElementById(endrowIndex).value) - 1; // Convert to 0-based index

  if (
    selectedTable &&
    colIndex >= 0 &&
    startRowIndex >= 0 &&
    endRowIndex >= startRowIndex
  ) {
    const rowsToMerge = Array.from(selectedTable.rows).slice(
      startRowIndex,
      endRowIndex + 1
    );

    if (rowsToMerge.length > 1) {
      const mergedText = rowsToMerge
        .map((row) => row.cells[colIndex]?.innerText || "")
        .join(" ");
      const firstCell = rowsToMerge[0].cells[colIndex];

      firstCell.rowSpan = rowsToMerge.length; // Set row span for the first cell
      firstCell.innerText = mergedText; // Set combined text

      // Hide merged cells in subsequent rows
      rowsToMerge.slice(1).forEach((row) => {
        row.cells[colIndex].style.display = "none";
      });

      // Clear toolbar inputs
      document.getElementById(mergeColIndex).value = "";
      document.getElementById(startrowIndex).value = "";
      document.getElementById(endrowIndex).value = "";
    }
  } else {
    // alert("Invalid row or column index.");
    showAlert("Invalid row or column index.");
  }
}

function addRow() {
  if (selectedTable && selectedCell) {
    const selectedRow = selectedCell.parentNode;
    const rowIndex = selectedRow.rowIndex;
    const newRow = selectedTable.insertRow(rowIndex + 1); // Insert below the selected row

    const cols = selectedTable.rows[0].cells.length;
    for (let i = 0; i < cols; i++) {
      const cell = newRow.insertCell();
      cell.contentEditable = true;
      cell.innerText = `New Row, Col ${i + 1}`;
      cell.onclick = () => selectCell(cell, selectedTable);
    }
  } else {
    // alert('Please select a cell to insert a row below.');
    showAlert("Please select a cell to insert a row below.");
  }
}

function addColumn() {
  if (selectedTable && selectedCell) {
    const colIndex = selectedCell.cellIndex;

    for (let i = 0; i < selectedTable.rows.length; i++) {
      const row = selectedTable.rows[i];
      const newCell = row.insertCell(colIndex + 1); // Insert right of the selected cell
      newCell.contentEditable = true;
      newCell.innerText = `Row ${i + 1}, New Col ${colIndex + 2}`;
      newCell.onclick = () => selectCell(newCell, selectedTable);
    }
  } else {
    // alert('Please select a cell to insert a column to the right.');
    showAlert("Please select a cell to insert a column to the right.");
  }
}

function setUniformSize() {
  if (selectedTable) {
    const width = prompt("Enter cell width in pixels:", "100");
    const height = prompt("Enter cell height in pixels:", "50");

    if (width && height) {
      const cells = selectedTable.getElementsByTagName("td");
      for (let cell of cells) {
        cell.style.width = `${width}px`;
        cell.style.height = `${height}px`;
      }
    }
  } else {
    // alert("Please select a table by clicking a cell first.");
    showAlert("Please select a table by clicking a cell first.");
  }
}

function deleteTable() {
  if (selectedTable) {
    selectedTable.remove(); // Remove the selected table from the DOM
    selectedTable = null; // Reset the selected table
    document.getElementById(toolbarId).style.display = "none"; // Hide the toolbar
  } else {
    // alert("Please select a table to delete.");
    showAlert("Please select a table to delete.");
  }
}

function deleteCell() {
  if (selectedCell) {
    const row = selectedCell.parentNode;
    row.deleteCell(selectedCell.cellIndex); // Delete the selected cell
    selectedCell = null; // Reset the selected cell
    document.getElementById(toolbarId).style.display = "none"; // Hide the toolbar
  } else {
    // alert("Please select a cell to delete.");
    showAlert("Please select a cell to delete.");
  }
}

function moveTableDown() {
  if (selectedTable) {
    // Adjust the margin-top to move the table down by 20px each click
    const currentMarginTop = parseInt(
      window.getComputedStyle(selectedTable).marginTop,
      10
    );
    selectedTable.style.marginTop = currentMarginTop + 10 + "px";
  }
}

function moveTableUp() {
  if (selectedTable) {
    // Adjust the margin-top to move the table down by 20px each click
    const currentMarginTop = parseInt(
      window.getComputedStyle(selectedTable).marginTop,
      10
    );
    selectedTable.style.marginTop = currentMarginTop - 10 + "px";
  }
}

let activeEditableDiv;

function createTextarea() {
  const specificDiv = tableContainer;

  // Create a contenteditable div
  const editableDiv = document.createElement("div");
  editableDiv.contentEditable = "true";
  editableDiv.className = "editable-div";
  // editableDiv.style.border = "1px solid #ccc";
  editableDiv.style.padding = "10px";
  editableDiv.style.height = "auto";
  editableDiv.style.fontSize = "16px"; // Default font size
  editableDiv.innerText = "Enter your text here...";

  // Show toolbar when div is focused (clicked)
  editableDiv.addEventListener("click", () => {
    activeEditableDiv = editableDiv;
    showToolbar();
  });

  // Add the editable div to the specific container
  specificDiv.appendChild(editableDiv);
  activeEditableDiv = editableDiv;

  function showToolbar() {
    const toolbar1 = document.getElementById(toolbar_text);
    toolbar1.style.display = "block";
  }
}

function hideToolbar() {
  const toolbar1 = document.getElementById(toolbar_text);
  toolbar1.style.display = "none";
}

// Toolbar action functions
function makeBold() {
  document.execCommand("bold");
}

function makeItalic() {
  document.execCommand("italic");
}

function makeUnderline() {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const selectedText = range.toString();

  if (selectedText) {
    const span = document.createElement("span");
    const currentStyle =
      range.startContainer.parentElement.style.textDecoration;

    // Check if the selected text is already underlined
    if (currentStyle === "underline") {
      // Remove underline
      range.startContainer.parentElement.style.textDecoration = "";
    } else {
      // Apply underline
      span.style.textDecoration = "underline";
      span.textContent = selectedText;

      // Replace the selected text with the underlined version
      range.deleteContents();
      range.insertNode(span);
    }
  }
}

function increaseFontSize() {
  document.execCommand("fontSize", false, "5"); // Larger font size (default options: 1-7)
}

function decreaseFontSize() {
  document.execCommand("fontSize", false, "3"); // Smaller font size
}

// Global event listener to hide toolbar if click is outside editable div or toolbar
document.addEventListener("click", (event) => {
  const toolbar1 = document.getElementById(toolbar_text);
  if (
    activeEditableDiv &&
    !toolbar1.contains(event.target) &&
    !activeEditableDiv.contains(event.target)
  ) {
    hideToolbar();
  }
});

function changeTextColor() {
  const color = document.getElementById(textColorPicker).value;
  document.execCommand("foreColor", false, color);
}

function highlightText() {
  const color = document.getElementById(highlightColorPicker).value;
  document.execCommand("backColor", false, color); // Use "hiliteColor" in some browsers
}
function toggleBulletPoints() {
  document.execCommand("insertUnorderedList"); // Toggles bullet points
}

function applyIndent() {
  document.execCommand("indent"); // Indent selected text
}

function applyOutdent() {
  document.execCommand("outdent"); // Outdent selected text
}

let selectedImages = [];
let selectedImageElement = null;

// Store the selected images when the user uploads them
document
  .getElementById("uploadImage")
  .addEventListener("change", function (event) {
    selectedImages = Array.from(event.target.files); // Convert file list to array
  });

// Display all selected images in the container when the button is clicked
function displayUploadedPhotos() {
  if (selectedImages.length > 0) {
    selectedImages.forEach((imageFile) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgElement = document.createElement("img");
        imgElement.src = e.target.result;
        imgElement.alt = "Uploaded Image";
        imgElement.onclick = () => showToolbar(imgElement);
        tableContainer.appendChild(imgElement);
      };
      reader.readAsDataURL(imageFile);
    });
  } else {
    // alert("Please select one or more images first.");
    showAlert("Please select one or more images first.");
  }
}

// Show toolbar above the clicked image
function showToolbar(imgElement) {
  selectedImageElement = imgElement; // Set the selected image element
  const toolbar = document.getElementById(imageToolbar);

  // Calculate position above the image
  const imgRect = imgElement.getBoundingClientRect();
  toolbar.style.display = "block";
  toolbar.style.top = `${imgRect.top - toolbar.offsetHeight - 10}px`;
  toolbar.style.left = `${imgRect.left}px`;
}

// Reduce the size of the selected image
function reduceImageSize() {
  if (selectedImageElement) {
    // Get the current width of the image in pixels
    const currentWidth = parseInt(
      window.getComputedStyle(selectedImageElement).width
    );
    // Reduce the width by 10px
    selectedImageElement.style.width = `${currentWidth - 10}px`;
  }
}

function increaseImageSize() {
  if (selectedImageElement) {
    const currentWidth = parseInt(
      window.getComputedStyle(selectedImageElement).width
    );
    selectedImageElement.style.width = `${currentWidth + 10}px`;
  }
}

function indentImageLeft() {
  if (selectedImageElement) {
    const currentMarginLeft =
      parseInt(window.getComputedStyle(selectedImageElement).marginLeft) || 0;
    selectedImageElement.style.marginLeft = `${currentMarginLeft - 10}px`; // Move left by 10px
  }
}

function indentImageRight() {
  if (selectedImageElement) {
    const currentMarginLeft =
      parseInt(window.getComputedStyle(selectedImageElement).marginLeft) || 0;
    selectedImageElement.style.marginLeft = `${currentMarginLeft + 10}px`; // Move right by 10px
  }
}

function setImageBorderColor() {
  if (selectedImageElement) {
    const color = document.getElementById(borderColorPicker).value;
    selectedImageElement.style.border = `2px solid ${color}`; // Apply border with the selected color
  }
}
function addMarginTop() {
  if (selectedImageElement) {
    const currentMarginTop =
      parseInt(window.getComputedStyle(selectedImageElement).marginTop) || 0;
    selectedImageElement.style.marginTop = `${currentMarginTop + 10}px`; // Move right by 10px
  }
}
function addMarginBottom() {
  if (selectedImageElement) {
    const currentMarginBottom =
      parseInt(window.getComputedStyle(selectedImageElement).marginTop) || 0;
    selectedImageElement.style.marginTop = `${currentMarginBottom - 10}px`; // Move right by 10px
  }
}

function deleteImage() {
  if (selectedImageElement) {
    tableContainer.removeChild(selectedImageElement);
  }
}

document
  .getElementById("save-button")
  .addEventListener("click", async function () {
    console.log("Processing... Please wait.");

    var wrapperDiv = document.getElementById(selectTemplate);
    if (!wrapperDiv) {
      // alert("Please Choose a Template");
      showAlert("Please Choose a Template");
      return;
    }

    try {
      await convertElementToJPG(wrapperDiv);
      console.log("Image conversion completed. Dispatching event...");

      // Dispatch an event when the image is ready
      document.dispatchEvent(new Event("imageReadyForUpload"));
    } catch (error) {
      console.error("Error during conversion:", error);
      // alert("Failed to capture image.");
      showAlert("Failed to capture image.");
    }
  });

function convertElementToJPG(element) {
  return new Promise((resolve, reject) => {
    if (typeof html2canvas !== "function") {
      console.error("html2canvas not loaded");
      // alert('Failed to capture image: Required library not loaded');
      showAlert("Failed to capture image: Required library not loaded");
      reject(new Error("html2canvas not loaded"));
      return;
    }

    const elementRect = element.getBoundingClientRect();
    const actualWidth = elementRect.width;
    const actualHeight = elementRect.height;

    const publisherDPI = 300;
    const screenDPI = 96;
    const scaleFactor = publisherDPI / screenDPI;

    const outputWidth = Math.round(actualWidth * scaleFactor);
    const outputHeight = Math.round(actualHeight * scaleFactor);

    const config = {
      scale: scaleFactor,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: actualWidth,
      height: actualHeight,
      scrollX: 0,
      scrollY: 0,
      imageTimeout: 60000,
      removeContainer: true,
      foreignObjectRendering: false,
      onclone: function (clonedDoc) {
        const clonedElement = clonedDoc.getElementById(selectTemplate);
        if (clonedElement) {
          clonedElement.style.height = actualHeight + "px";
          clonedElement.style.overflow = "visible";
        }
      },
    };

    html2canvas(element, config)
      .then((canvas) => {
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = outputWidth;
        finalCanvas.height = outputHeight;
        const ctx = finalCanvas.getContext("2d", { alpha: false });

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        ctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);

        return finalCanvas.toDataURL("image/jpeg", 1.0);
      })
      .then((imgData) => {
        return fetch(imgData)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "convertedImage.jpeg", {
              type: "image/jpeg",
            });

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            const imageInput = document.getElementById("image-input");
            imageInput.files = dataTransfer.files;

            console.log("Image assigned to file input:", imageInput.files);
            resolve();
          });
      })
      .catch((error) => {
        console.error("Error generating image:", error);
        // alert('Failed to capture image. Please try again.');
        showAlert("Failed to capture image. Please try again.");
        reject(error);
      });
  });
}

function changeBackgroundColor() {
  // Get all required elements
  const mainDiv = document.getElementById("custom-template-user");
  const graphDiv = document.getElementById("custom-template-graph-container");
  const tableDiv = document.getElementById("custom-template-table-container");
  const thElements = document.querySelectorAll(".batch-info-custom-user");
  const traineeThElements = document.querySelectorAll(
    ".trainee-evaluation-custom-user-template th"
  );
  const h1Elements = document.querySelectorAll(".box-template-custom-user h1");
  const trainerNameH3 = document.querySelectorAll(
    "#trainer-name-custom-user-template h3"
  );
  const tableContainer = document.querySelectorAll(
    ".tablecontainer-custom-user"
  );

  const styletablesBorder = document.querySelectorAll(
    "#tableContent-custom-user table"
  );

  // Generate random color
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // Convert hex color to RGB
  const r = parseInt(randomColor.substring(0, 2), 16);
  const g = parseInt(randomColor.substring(2, 4), 16);
  const b = parseInt(randomColor.substring(4, 6), 16);

  // Apply colors to batch-info elements
  thElements.forEach((th) => {
    th.style.backgroundColor = `#${randomColor}`;
    th.style.color = "rgb(250, 245, 245)";
  });

  // Apply colors to trainee-evaluation elements
  traineeThElements.forEach((th) => {
    th.style.backgroundColor = `#${randomColor}`;
    th.style.color = "rgb(250, 245, 245)";
  });

  // Apply color to h1 elements
  h1Elements.forEach((h1) => {
    h1.style.color = `#${randomColor}`;
  });

  styletablesBorder.forEach((h1) => {
    h1.style.border = `2px solid #${randomColor}`;
  });

  // Apply color to trainer name h3 elements
  trainerNameH3.forEach((h3) => {
    h3.style.color = `#${randomColor}`;
  });

  // Apply background color to table container elements
  tableContainer.forEach((container) => {
    container.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.10)`;
  });

  const h1InHeadingContainer = document.querySelector(
    "#custom-template-heading-container h1"
  );
  if (h1InHeadingContainer) {
    h1InHeadingContainer.style.color = `#${randomColor}`; // Change color of h1 in specific div
  }

  // Set background colors with opacity
  mainDiv.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
  graphDiv.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.10)`;
  tableDiv.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.10)`;
  h1InHeadingContainer.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.10)`;

  // Create a style element
  const styleElement = document.createElement("style");
  styleElement.textContent = `
.styleTemplate1 {
    font-weight: bold;
    color: #${randomColor};
}

.styleTemplate2 {
    font-style: italic;
    color: #${randomColor};
}

.styleTemplate3 {
    text-transform: uppercase;
    color: #${randomColor};
    letter-spacing: 2px;
}

.styleTemplate4 {
    text-decoration: underline;
    color: #${randomColor};
}

.styleTemplate5 {
    font-weight: 300;
    color: #${randomColor};
    background-color: white;
    padding: 5px;
}

.styleTemplate6 {
    font-weight: bold;
    color: #${randomColor};
    background-color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    padding: 10px;
}

.styleTemplate7 {
    color: #${randomColor};
    border: 2px dashed #${randomColor};
    padding: 5px;
    border-radius: 10px;
}

.styleTemplate8 {
    color: #${randomColor};
    background: linear-gradient(to right, 
        rgba(${r}, ${g}, ${b}, 0.1),
        rgba(${r}, ${g}, ${b}, 0.2)
    );
    padding: 10px;
    border-radius: 5px;
}

.styleTemplate9 {
    font-weight: bold;
    color: #${randomColor};
    border-left: 5px solid #${randomColor};
    padding-left: 10px;
}

.styleTemplate10 {
    font-style: oblique;
    color: #${randomColor};
    background-color: rgba(${r}, ${g}, ${b}, 0.1);
    padding: 8px;
    border-radius: 5px;
}
`;

  // Remove existing style element if it exists
  const existingStyle = document.querySelector("#dynamicStyles");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Add ID to new style element and append to document
  styleElement.id = "dynamicStyles";
  document.head.appendChild(styleElement);
}
document
  .getElementById("changeColorButton")
  .addEventListener("click", changeBackgroundColor);

function changeLayout(style) {
  const container = document.getElementById("custom-template-table-container");
  const allDivs = Array.from(container.children); // Get all child divs

  // Clear previous styles
  container.classList.remove(
    "styleTable1",
    "styleTable2",
    "styleTable3",
    "styleTable4",
    "styleTable5"
  );
  container.classList.add(style); // Apply new style

  // Apply the selected style to each div individually
  allDivs.forEach((div) => {
    div.classList.remove(
      "styleTable1",
      "styleTable2",
      "styleTable",
      "styleTable4",
      "styleTable5"
    ); // Remove existing styles
    div.classList.add(style); // Add the new style
  });
}

function addBreakpointClickListener() {
  let isBreakpointMode = false;

  const button = document.getElementById("breakPointButton");

  button.addEventListener("click", () => {
    isBreakpointMode = !isBreakpointMode;
    document.body.style.cursor = isBreakpointMode ? "crosshair" : "default";
  });

  // Add click listeners to specific divs only
  const allowedDivs = document.querySelectorAll(".custom-template-user");
  allowedDivs.forEach((div) => {
    div.addEventListener("click", (e) => {
      if (!isBreakpointMode) return;

      // Create a new horizontal line element
      const breakpoint = document.createElement("div");
      breakpoint.className = "breakpointcustomuser";

      // Get click position relative to the div
      // const rect = div.getBoundingClientRect();
      const y = e.clientY; // Y position relative to the div

      // Style the horizontal line
      breakpoint.style.cssText = `
              position: absolute;
              left: 0;
              top: ${y}px;
              width: 800px;
              height: 2px;
              background-color: #000;
              pointer-events: none; /* Ensure the line doesn't interfere with clicks */
          `;

      // Append the line to the specific div
      div.appendChild(breakpoint);
    });
  });
}

const styles = [
  "styleTemplate1",
  "styleTemplate2",
  "styleTemplate3",
  "styleTemplate4",
  "styleTemplate5",
  "styleTemplate6",
  "styleTemplate7",
  "styleTemplate8",
  "styleTemplate9",
  "styleTemplate10",
];

let currentStyleIndex = 0;

function applyNextStyle() {
  const parentDiv = document.querySelector(".custom-template-user");

  if (!parentDiv) return;

  // Select all direct child divs only (using parentDiv.children)
  const allChildDivs = Array.from(parentDiv.children).filter(
    (child) => child.tagName === "DIV"
  );

  // Remove all previous styles
  allChildDivs.forEach((div) => {
    styles.forEach((style) => div.classList.remove(style));
  });

  // Get the next style from the list
  const nextStyle = styles[currentStyleIndex];

  // Apply the new style to all child divs
  allChildDivs.forEach((div) => div.classList.add(nextStyle));

  // Move to the next style, loop back if needed
  currentStyleIndex = (currentStyleIndex + 1) % styles.length;
}

// Attach to a button click
document
  .getElementById("styleChangeButton")
  .addEventListener("click", applyNextStyle);

document.addEventListener("DOMContentLoaded", function () {
  const tabContent = document.getElementById("custom");
  const tabLink = document.getElementById("tabLinkCustom");
  const toggleImage = document.getElementById("toggleCustomImage");

  // Initially hide the tab link
  tabLink.style.display = "none";

  toggleImage.addEventListener("click", function (event) {
    // Show the tab link when clicking the image
    tabLink.style.display = "block";

    // Stop event from propagating
    event.stopPropagation();

    // Remove the event listener after the first click so it stays visible forever
    document.removeEventListener("click", hideTabLink);
  });

  function hideTabLink(event) {
    if (event.target !== toggleImage) {
      tabLink.style.display = "none"; // Hide tab link
    }
  }

  // Initially set up the event listener to hide the tab link when clicking outside
  document.addEventListener("click", hideTabLink);
});

let isTableView = true;

// Toggle between table view and chart view
function toggleView() {
  let tableDiv = document.getElementById("tablecontainer-custom-user");
  let chartDiv = document.getElementById("chartDiv");
  if (isTableView) {
    // tableDiv.style.display = "none";
    chartDiv.style.display = "block";
    generateCharts();
  } else {
    tableDiv.style.display = "block";
    chartDiv.style.display = "none";
  }
  isTableView = !isTableView;
}

// Generate charts for numeric tables
function generateCharts() {
  let chartGrid = document.getElementById("chartGrid");
  chartGrid.innerHTML = ""; // Clear previous content

  let tables = document.querySelectorAll("#tableContent-custom-user table");
  tables.forEach((table, index) => {
    let rows = table.querySelectorAll("tr");
    let headers = [];
    let values = [];
    let isNumericTable = false;

    // Extract headers
    let headerCells = rows[0].getElementsByTagName("td");
    for (let cell of headerCells) {
      headers.push(cell.innerText);
    }

    // Extract data from remaining rows
    for (let i = 1; i < rows.length; i++) {
      let cells = rows[i].getElementsByTagName("td");
      if (cells.length === 2 && !isNaN(cells[1].innerText)) {
        isNumericTable = true;
        values.push({
          label: cells[0].innerText,
          value: parseInt(cells[1].innerText),
        });
      }
    }

    // If the table contains numeric data, create a chart and remove it from the main div
    if (isNumericTable) {
      createChart(headers, values, index, chartGrid);
      table.remove(); // Remove the numeric table from the main div
    }
    // Non-numeric tables remain untouched in their original container
  });
}

// Create a chart based on the extracted data
function createChart(headers, values, index, chartGrid) {
  // Create a container for the chart
  let chartContainer = document.createElement("div");
  chartContainer.className = "chart-container";
  // chartContainer.style.position = "absolute";
  chartContainer.style.left = `${50 + (index % 3) * 300}px`; // Adjust horizontal spacing
  chartContainer.style.top = `${50 + Math.floor(index / 3) * 300}px`; // Adjust vertical spacing
  chartContainer.style.width = "300px"; // Initial width
  chartContainer.style.height = "400px"; // Initial height
  chartContainer.style.border = "1px solid #ccc"; // Optional border for visibility
  chartContainer.style.backgroundColor = "white"; // White background for the chart
  chartContainer.style.overflow = "hidden"; // Prevent overflow
  chartContainer.style.margin = "0";

  // Add a heading for the chart
  let heading = document.createElement("div");
  heading.className = "chart-heading";
  heading.contentEditable = true; // Make the heading editable
  heading.innerText = "Enter Chart Title Here"; // Default title
  heading.style.textAlign = "center";
  heading.style.fontWeight = "800";

  heading.style.padding = "5px";
  heading.style.cursor = "text";
  chartContainer.appendChild(heading);

  // Create a canvas element for the chart
  let canvas = document.createElement("canvas");
  canvas.id = "chartCanvas" + index;
  canvas.style.width = "100%"; // Ensure canvas fits the container
  canvas.style.height = "calc(100% - 40px)"; // Leave space for the heading
  canvas.style.padding = "50px";
  chartContainer.appendChild(canvas);
  chartGrid.appendChild(chartContainer);

  // Render the chart using Chart.js
  let ctx = canvas.getContext("2d");
  let myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: values.map((v) => v.label),
      datasets: [
        {
          label: headers[1],
          data: values.map((v) => v.value),
          backgroundColor: ["red", "blue", "green", "orange", "purple", "cyan"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true, // Enable responsiveness
      maintainAspectRatio: false, // Allow custom aspect ratio
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Make the chart draggable and resizable
  makeDraggable(chartContainer);
  enableResizing(chartContainer, myChart);
}

// Make an element draggable
function makeDraggable(element) {
  let offsetX = 0,
    offsetY = 0,
    isDragging = false;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    element.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    element.style.cursor = "grab";
  });
}

// Make an element resizable
function enableResizing(element, chartInstance = null) {
  let isResizingActive = false;
  let initialWidth, initialHeight, startX, startY;

  const handleResizeAction = (e) => {
    if (!isResizingActive) return;

    const maxAllowedWidth = getMaxWidthForElement(element);
    const newWidth = initialWidth + (e.clientX - startX);
    const newHeight = initialHeight + (e.clientY - startY);
    const elementsInSameRow = getElementsInSameRow(element);

    if (newWidth >= 150) {
      element.style.width = Math.min(newWidth, maxAllowedWidth) + "px";

      if (elementsInSameRow.length === 3 && newWidth > maxAllowedWidth) {
        const nextRowElements = Array.from(
          element.parentElement.children
        ).filter((div) => {
          const divRect = div.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          return (
            divRect.top > elementRect.top &&
            divRect.top < elementRect.top + elementRect.height + 50
          );
        });

        if (nextRowElements.length > 0) {
          element.style.width =
            getParentContainerWidth(element) -
            nextRowElements.reduce(
              (sum, div) => sum + div.offsetWidth + 10,
              0
            ) -
            20 +
            "px";
        }
      }
    }
    if (newHeight >= 100) {
      element.style.height = newHeight + "px";
    }

    // Resize the chart to fit the container
    if (chartInstance) {
      chartInstance.resize();
    }

    // Ensure child elements (like canvas) fit inside the container
    Array.from(element.children).forEach((child) => {
      if (child.tagName.toLowerCase() !== "button") {
        // Exclude buttons
        child.style.maxWidth = "100%";
        child.style.maxHeight = "100%";
        child.style.objectFit = "contain";
      }
    });
  };

  element.addEventListener("mousedown", function (e) {
    const box = element.getBoundingClientRect();
    const resizeRegion = 20;

    if (
      e.clientX > box.right - resizeRegion &&
      e.clientY > box.bottom - resizeRegion
    ) {
      isResizingActive = true;
      initialWidth = parseFloat(
        getComputedStyle(element, null)
          .getPropertyValue("width")
          .replace("px", "")
      );
      initialHeight = parseFloat(
        getComputedStyle(element, null)
          .getPropertyValue("height")
          .replace("px", "")
      );
      startX = e.clientX;
      startY = e.clientY;
      e.preventDefault();
    }
  });

  document.addEventListener("mousemove", handleResizeAction);

  document.addEventListener("mouseup", function () {
    isResizingActive = false;
  });
}

// Helper function to calculate the maximum allowed width
function getMaxWidthForElement(element) {
  const parentWidth = getParentContainerWidth(element);
  const siblings = Array.from(element.parentElement.children).filter(
    (el) => el !== element
  );
  const siblingWidth = siblings.reduce(
    (sum, sibling) => sum + sibling.offsetWidth + 10,
    0
  );
  return parentWidth - siblingWidth - 20; // Subtract padding and margins
}

// Helper function to get the parent container width
function getParentContainerWidth(element) {
  return element.parentElement.getBoundingClientRect().width;
}

// Helper function to get elements in the same row
function getElementsInSameRow(element) {
  const elementRect = element.getBoundingClientRect();
  return Array.from(element.parentElement.children).filter((div) => {
    const divRect = div.getBoundingClientRect();
    return divRect.top === elementRect.top;
  });
}

// Function to get the existing border color of the tables in a specific container
function getTableBorderColor(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return "#e2e8f0"; // Default fallback color if container doesn't exist

  const tables = container.getElementsByTagName("table");
  if (tables.length === 0) return "#e2e8f0"; // Default fallback color if no tables exist

  // Extract the border color from the first table in the container
  const computedStyle = window.getComputedStyle(tables[0]);
  const borderColor =
    computedStyle.borderTopColor || computedStyle.borderLeftColor;

  // Check if the border color is transparent or not set, and fallback to default
  return borderColor !== "rgba(0, 0, 0, 0)" ? borderColor : "#e2e8f0";
}

// Keep track of current style
let currentStyleIndexTable = 0;

const tableStylesCss = [
  // Style 1: No Borders - Clean Layout
  {
    container: `
        display: flex;
        flex-direction: column;
        gap: 30px;
        padding: 20px;
    `,
    table: `
        width: 100%;
        border-collapse: collapse;
    `,
    additionalCSS: (borderColor) => `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th {
            padding: 12px; 
            text-align: left;
            border: none;
        }
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 8px;
            border: none;
        }
    `,
  },
  // Style 2: Left Border Only
  {
    container: `
        display: flex;
        flex-direction: column;
        gap: 25px;
        padding: 20px;
    `,
    table: (borderColor) => `
        width: 100%;
        border-collapse: collapse;
        border-left: 2px solid ${borderColor};
    `,
    additionalCSS: `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th,
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 10px;
            border: none;
        }
    `,
  },
  // Style 3: Top and Bottom Borders
  {
    container: `
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
        padding: 20px;
    `,
    table: (borderColor) => `
        width: 100%;
        border-collapse: collapse;
        border-top: 2px solid ${borderColor};
        border-bottom: 2px solid ${borderColor};
    `,
    additionalCSS: `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th,
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 12px;
            border: none;
        }
    `,
  },
  // Style 4: Bottom Border Only on Rows
  {
    container: `
        display: flex;
        flex-direction: column;
        gap: 40px;
        padding: 25px;
    `,
    table: `
        width: 100%;
        border-collapse: collapse;
    `,
    additionalCSS: (borderColor) => `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th {
            padding: 12px;
            border-bottom: 2px solid ${borderColor};
        }
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 12px;
            border-bottom: 1px solid ${borderColor};
        }
    `,
  },
  // Style 5: Left and Right Borders
  {
    container: `
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        padding: 15px;
    `,
    table: (borderColor) => `
        width: 100%;
        border-collapse: collapse;
        border-left: 2px solid ${borderColor};
        border-right: 2px solid ${borderColor};
    `,
    additionalCSS: `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th,
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 8px;
            border: none;
        }
    `,
  },
  // Style 6: Top Border Only
  {
    container: `
        display: flex;
        flex-direction: column;
        gap: 35px;
        padding: 20px;
    `,
    table: (borderColor) => `
        width: 100%;
        border-collapse: collapse;
        border-top: 3px solid ${borderColor};
    `,
    additionalCSS: `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th,
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 10px;
            border: none;
        }
    `,
  },
  // Style 7: Three Sided (No Bottom)
  {
    container: `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
        padding: 20px;
    `,
    table: (borderColor) => `
        width: 100%;
        border-collapse: collapse;
        border-top: 2px solid ${borderColor};
        border-left: 2px solid ${borderColor};
        border-right: 2px solid ${borderColor};
    `,
    additionalCSS: `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th,
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 10px;
            border: none;
        }
    `,
  },
  // Style 8: Bottom and Right Borders on Cells
  {
    container: `
        display: flex;
        flex-direction: column;
        gap: 30px;
        padding: 20px;
    `,
    table: `
        width: 100%;
        border-collapse: collapse;
    `,
    additionalCSS: (borderColor) => `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th,
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 12px;
            border-bottom: 1px solid ${borderColor};
            border-right: 1px solid ${borderColor};
        }
        #tableContent-custom-user table th:last-child,
        .trainee-evaluation-custom-user-template table th:last-child,
        #tableContent-custom-user table td:last-child,
        .trainee-evaluation-custom-user-template table td:last-child {
            border-right: none;
        }
    `,
  },
  // Style 9: Right Border Only
  {
    container: `
        display: flex;
        flex-direction: column;
        gap: 28px;
        padding: 20px;
        align-items: center;
    `,
    table: (borderColor) => `
        width: 80%;
        border-collapse: collapse;
        border-right: 2px solid ${borderColor};
    `,
    additionalCSS: `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th,
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 10px;
            border: none;
        }
    `,
  },
  // Style 10: Three Sided (No Top)
  {
    container: `
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
        padding: 20px;
    `,
    table: (borderColor) => `
        width: 100%;
        border-collapse: collapse;
        border-bottom: 2px solid ${borderColor};
        border-left: 2px solid ${borderColor};
        border-right: 2px solid ${borderColor};
    `,
    additionalCSS: `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th,
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 12px;
            border: none;
        }
    `,
  },
  // Style 11: Alternating Row Colors
  {
    container: `
        display: flex;
        flex-direction: column;
        gap: 30px;
        padding: 20px;
    `,
    table: `
        width: 100%;
        border-collapse: collapse;
    `,
    additionalCSS: (borderColor) => `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th {
            padding: 12px;
            background-color: #f7fafc;
            border-bottom: 2px solid ${borderColor};
        }
        #tableContent-custom-user table tr:nth-child(even) td,
        .trainee-evaluation-custom-user-template table tr:nth-child(even) td {
            background-color: #edf2f7;
        }
        #tableContent-custom-user table tr:nth-child(odd) td,
        .trainee-evaluation-custom-user-template table tr:nth-child(odd) td {
            background-color: #ffffff;
        }
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 10px;
            border-bottom: 1px solid ${borderColor};
        }
    `,
  },
  // Style 12: Rounded Corners with Shadow
  {
    container: `
        display: flex;
        flex-direction: column;
        gap: 30px;
        padding: 20px;
    `,
    table: (borderColor) => `
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border: 1px solid ${borderColor};
    `,
    additionalCSS: `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th {
            padding: 12px;
            background-color: #f7fafc;
            border-bottom: 2px solid #e2e8f0;
        }
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        #tableContent-custom-user table tr:first-child th,
        .trainee-evaluation-custom-user-template table tr:first-child th {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        #tableContent-custom-user table tr:last-child td,
        .trainee-evaluation-custom-user-template table tr:last-child td {
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
        }
    `,
  },
  // Style 13: Minimalist with Light Background
  {
    container: `
        display: flex;
        flex-direction: column;
        gap: 30px;
        padding: 20px;
        background-color: #f7fafc;
    `,
    table: `
        width: 100%;
        border-collapse: collapse;
    `,
    additionalCSS: (borderColor) => `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th {
            padding: 12px;
            text-align: left;
            font-weight: bold;
            color: #2d3748;
            border-bottom: 2px solid ${borderColor};
        }
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 10px;
            color: #4a5568;
            border-bottom: 1px solid ${borderColor};
        }
    `,
  },
  // Style 14: Bold Header with Subtle Divider
  {
    container: `
        display: flex;
        flex-direction: column;
        gap: 30px;
        padding: 20px;
    `,
    table: `
        width: 100%;
        border-collapse: collapse;
    `,
    additionalCSS: (borderColor) => `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th {
            padding: 12px;
            background-color: #f7fafc;
            border-bottom: 3px solid ${borderColor};
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 10px;
            border-bottom: 1px solid ${borderColor};
        }
    `,
  },
  // Style 15: Compact Layout with Center Alignment
  {
    container: `
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 15px;
    `,
    table: (borderColor) => `
        width: 100%;
        border-collapse: collapse;
        border: 1px solid ${borderColor};
    `,
    additionalCSS: `
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th,
        #tableContent-custom-user table td,
        .trainee-evaluation-custom-user-template table td {
            padding: 8px;
            text-align: center;
        }
        #tableContent-custom-user table th,
        .trainee-evaluation-custom-user-template table th {
            background-color: #f7fafc;
            font-weight: bold;
        }
    `,
  },
];

// Function to apply styles
function applyTableStyle(styleConfig, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return; // Exit if the container doesn't exist

  const tables = container.getElementsByTagName("table");

  // Get the border color from the tables in the specific container
  const borderColor = getTableBorderColor(containerId);

  // Apply container styles
  container.style.cssText = styleConfig.container;

  // Apply styles to each table
  Array.from(tables).forEach((table) => {
    table.style.cssText =
      typeof styleConfig.table === "function"
        ? styleConfig.table(borderColor)
        : styleConfig.table;
  });

  // Remove any previously added style tag for this container
  const existingStyle = document.getElementById(
    `dynamic-table-styles-${containerId}`
  );
  if (existingStyle) {
    existingStyle.remove();
  }

  // Add additional CSS if present
  if (styleConfig.additionalCSS) {
    const styleTag = document.createElement("style");
    styleTag.id = `dynamic-table-styles-${containerId}`;
    styleTag.textContent =
      typeof styleConfig.additionalCSS === "function"
        ? styleConfig.additionalCSS(borderColor)
        : styleConfig.additionalCSS;
    document.head.appendChild(styleTag);
  }
}

// Function to toggle between styles for multiple containers
function toggleTableStyles() {
  const containerIds = [
    "tableContent-custom-user",
    "trainee-evaluation-custom-user-template",
    "tableContent-customAbove-user",
  ];

  containerIds.forEach((containerId) => {
    currentStyleIndexTable =
      (currentStyleIndexTable + 1) % tableStylesCss.length;
    applyTableStyle(tableStylesCss[currentStyleIndexTable], containerId);
  });
}

function updateTableContainerVisibility(tableContainer, tableId) {
  if (!tableContainer || !tableId) return;

  let hasContent = tableContainer.innerHTML.trim() !== ""; // Ensure content detection
  console.log(`Checking content for ${tableId}: `, hasContent); // Debugging

  let parentDiv = document.getElementById(tableId);

  if (parentDiv) {
    if (hasContent) {
      switch (tableId) {
        case "tablecontainer2":
        case "tablecontainerAbove2":
          parentDiv.style.width = "100%";
          parentDiv.style.borderCollapse = "collapse";
          parentDiv.style.margin = "20px auto";
          parentDiv.style.padding = "10px";
          parentDiv.style.border = "solid 1px white";
          parentDiv.style.borderRadius = "8px";
          parentDiv.style.transition = "all 0.3s ease-in-out";
          parentDiv.style.backgroundColor = "white";
          break;

        case "tablecontainer3":
        case "tablecontainerAbove3":
          parentDiv.style.height = "auto";
          parentDiv.style.color = "black";
          parentDiv.style.backgroundColor = "white";
          parentDiv.style.width = "100%";
          parentDiv.style.borderCollapse = "collapse";
          parentDiv.style.margin = "30px auto";
          parentDiv.style.padding = "10px";
          parentDiv.style.border = "solid 2px black";
          break;

        case "tablecontainer5":
        case "tablecontainerAbove5":
          parentDiv.style.height = "auto";
          parentDiv.style.color = "black";
          parentDiv.style.backgroundColor = "white";
          parentDiv.style.width = "100%";
          parentDiv.style.borderCollapse = "collapse";
          parentDiv.style.margin = "20px auto";
          parentDiv.style.padding = "10px";
          parentDiv.style.border = "solid 1px #90a4ae";
          break;

        case "tablecontainer-custom":
        case "tablecontainerAbove-custom":
          parentDiv.style.height = "auto";
          parentDiv.style.color = "black";
          parentDiv.style.backgroundColor = "white";
          parentDiv.style.width = "100%";
          parentDiv.style.borderCollapse = "collapse";
          parentDiv.style.margin = "20px auto";
          parentDiv.style.padding = "10px";
          parentDiv.style.border = "solid 1px #dc143c";
          parentDiv.style.borderRadius = "8px";
          break;

        case "tablecontainer-custom-user":
        case "tablecontainer-customAbove-user":
          parentDiv.style.height = "auto";
          parentDiv.style.color = "black";
          parentDiv.style.backgroundColor = "white";
          parentDiv.style.width = "100%";
          parentDiv.style.borderCollapse = "collapse";
          parentDiv.style.margin = "20px auto";
          parentDiv.style.padding = "10px";
          parentDiv.style.border = "solid 1px transparent";
          parentDiv.style.borderRadius = "8px";
          break;

        default:
          console.warn(`No predefined styles for ${tableId}`);
      }
    } else {
      // Hide when empty
      parentDiv.style.backgroundColor = "transparent";
      parentDiv.style.border = "none";
      parentDiv.style.padding = "0";
    }
  }
}

// Attach event listener when adding a table section
let addButton = document.getElementById("addTableSectionTrigger");
// Select the add button using multiple IDs
let addButtonIds = [
  "addTableSectionTrigger",
  "addTableSectionTriggerImage",
  "addTextForTableSpace",
];

addButtonIds.forEach((id) => {
  let addButton = document.getElementById(id);
  if (addButton) {
    addButton.addEventListener("click", () => {
      setTimeout(() => {
        updateTableContainerVisibility(tableContainer, tableId);
      }, 100);
    });
  }
});
