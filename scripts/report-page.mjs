import { checkAuth, logout } from "./auth.js";
import { db, storage } from "./firebaseConfig.mjs";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  getDoc,
  where,
  query,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";

import uploadImageToFirebase from "../scripts/uploadimage.mjs";

// Check authentication status
checkAuth();

// Attach logout function to the logout button
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".logout").addEventListener("click", logout);
});

//--------------------------SCROLL TEMPLATES----------------------//

// const imageScroll = document.getElementById("image-scroll");
// const arrowUp = document.getElementById("arrow-up");
// const arrowDown = document.getElementById("arrow-down");

// // Variables to control scrolling
// let scrollPosition = 0;
// const scrollStep = 150; // Adjust this value to control how much the images move on each click

// // Update maximum scroll based on the image container size
// function updateMaxScroll() {
//   const maxScroll =
//     imageScroll.scrollHeight - imageScroll.parentElement.offsetHeight;
//   return maxScroll > 0 ? maxScroll : 0;
// }

// // Scroll up by clicking the arrow
// arrowUp.addEventListener("click", () => {
//   if (scrollPosition > 0) {
//     scrollPosition -= scrollStep;
//     if (scrollPosition < 0) scrollPosition = 0; // Prevent over-scrolling
//     imageScroll.scrollTo({ top: scrollPosition, behavior: "smooth" });
//   }
//   updateArrowVisibility();
// });

// // Scroll down by clicking the arrow
// arrowDown.addEventListener("click", () => {
//   const maxScroll = updateMaxScroll();
//   if (scrollPosition < maxScroll) {
//     scrollPosition += scrollStep;
//     if (scrollPosition > maxScroll) scrollPosition = maxScroll; // Prevent over-scrolling
//     imageScroll.scrollTo({ top: scrollPosition, behavior: "smooth" });
//   }
//   updateArrowVisibility();
// });

// // Handle manual scrolling with mouse or trackpad
// imageScroll.addEventListener("scroll", () => {
//   scrollPosition = imageScroll.scrollTop;
//   updateArrowVisibility();
// });

// // Update arrow visibility based on scroll position
// function updateArrowVisibility() {
//   const maxScroll = updateMaxScroll();
//   arrowUp.style.visibility = scrollPosition > 0 ? "visible" : "hidden";
//   arrowDown.style.visibility =
//     scrollPosition < maxScroll ? "visible" : "hidden";
// }

// // Initialize arrow visibility
// updateArrowVisibility();

//--------------------TEMPLATE SELECTION-------------------------//

let selectedTemplate = "";
let templateKey = "";

document.addEventListener("DOMContentLoaded", async () => {
  const images = document.querySelectorAll(".image-container img");
  const templates = document.querySelectorAll(".workspace > div");
  // let selectTemplate;

  function hideAllTemplates() {
    templates.forEach((template) => {
      template.style.display = "none";
    });
  }
  const batchSelect = document.getElementById("batchSelect");
  async function getFilteredDocuments(batchName) {
    try {
      const collectionName = await getLatestCollection();
      if (!collectionName) {
        console.error("No collection name found");
        return null;
      }

      const colRef = collection(db, collectionName);
      const q = query(colRef, where("batchName", "==", batchName));
      const snapshot = await getDocs(q);

      const filteredData = snapshot.docs.map((doc) => doc.data());
      console.log("filtered Data", filteredData);

      return filteredData;
    } catch (error) {
      console.error("Error fetching filtered documents:", error);
      return null;
    }
  }

  async function populateBatchOptions() {
    try {
      const collectionName = await getLatestCollection();
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);

      const batchNames = [
        ...new Set(snapshot.docs.map((doc) => doc.data().batchName)),
      ];

      batchSelect.innerHTML =
        '<option value="whole-batch">All Batches</option>';
      batchNames.forEach((batch) => {
        const option = document.createElement("option");
        option.value = batch;
        option.textContent = batch;
        batchSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading batch options:", error);
    }
  }

  batchSelect.addEventListener("change", async (e) => {
    const selectedBatch = e.target.value;
    if (selectedBatch) {
      console.log("gggggggg", selectedBatch);
      const filteredData = await getFilteredDocuments(selectedBatch);
      console.log("Filtered Data:", filteredData);
    }
  });
  await populateBatchOptions();

  function getTraineeDetails(data, id) {
    const createTable = document.getElementById(id);
    createTable.innerHTML = "";
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    const headers = ["SI No.", "Trainee Name", "DU", "Avg. Attendance"];

    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.appendChild(document.createTextNode(headerText));
      headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    data.forEach((item, index) => {
      const row = document.createElement("tr");
      const siNoCell = document.createElement("td");
      siNoCell.appendChild(document.createTextNode(index + 1));
      row.appendChild(siNoCell);

      const traineeCell = document.createElement("td");
      traineeCell.appendChild(document.createTextNode(item.traineeName));
      row.appendChild(traineeCell);

      const duCell = document.createElement("td");
      duCell.appendChild(document.createTextNode(item.du));
      row.appendChild(duCell);

      const attendanceCell = document.createElement("td");
      attendanceCell.appendChild(document.createTextNode(item.avgAttendance));
      row.appendChild(attendanceCell);

      table.appendChild(row);
    });

    return table;
  }

  function getAllBatchTraineeDetails(data, id) {
    const createTable = document.getElementById(id);
    createTable.innerHTML = ""; // Clear existing content
    const table = document.createElement("table");
    table.style.border = "1"; // Optional: Add border to the table for better visibility

    const headerRow = document.createElement("tr");
    const headers = [
      "SI No.",
      "Trainee Name",
      "Batch",
      "DU",
      "Avg. Attendance",
    ];

    // Create a set to hold unique evaluation names
    const uniqueEvaluations = new Set();

    // First pass to gather unique evaluations
    data.forEach((item) => {
      item.evaluations.forEach((evaluation) => {
        if (evaluation.evaluationName && evaluation.evaluationName !== "N/A") {
          uniqueEvaluations.add(evaluation.evaluationName);
        }
      });
    });

    // Add evaluation headers to the headers array
    uniqueEvaluations.forEach((evaluation) => {
      headers.push(evaluation);
    });

    // Create table headers
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText; // Set the text content of the header
      headerRow.appendChild(th);
    });

    // Append the header row to the table
    table.appendChild(headerRow);

    // Populate table rows
    data.forEach((item, index) => {
      const row = document.createElement("tr");

      const siNoCell = document.createElement("td");
      siNoCell.textContent = index + 1; // SI No.
      row.appendChild(siNoCell);

      const traineeCell = document.createElement("td");
      traineeCell.textContent = item.traineeName; // Trainee Name
      row.appendChild(traineeCell);

      const batchCell = document.createElement("td");
      batchCell.textContent = item.batchName; // Batch
      row.appendChild(batchCell);

      const duCell = document.createElement("td");
      duCell.textContent = item.du; // DU
      row.appendChild(duCell);

      const attendanceCell = document.createElement("td");
      attendanceCell.textContent = item.avgAttendance; // Avg. Attendance
      row.appendChild(attendanceCell);

      // Create a mapping for evaluations
      const evaluationMap = {};
      item.evaluations.forEach((evaluation) => {
        if (evaluation.evaluationName && evaluation.evaluationName !== "N/A") {
          evaluationMap[evaluation.evaluationName] = evaluation.evaluationScore;
        }
      });

      // Populate evaluation scores in the row
      uniqueEvaluations.forEach((evaluationName) => {
        const evaluationCell = document.createElement("td");
        evaluationCell.textContent = evaluationMap[evaluationName] || ""; // Evaluation Score
        row.appendChild(evaluationCell);
      });

      table.appendChild(row); // Append each row to the table
    });

    createTable.appendChild(table);
    return table;
  }

  async function generateChart(data, id) {
    const canvas = document.getElementById(id);
    if (!canvas) {
      console.error(`Canvas with id "${id}" not found`);
      return;
    }

    const ctx = canvas.getContext("2d");
    const chartData = {
      labels: data.map((item) => item.traineeName),
      datasets: [
        {
          label: "Avg. Attendance",
          data: data.map((item) => item.avgAttendance),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  async function generateChartToggle(data, id, chartType = "line") {
    const canvas = document.getElementById(id);
    console.log(`Selected chart type: ${chartType}`); // Log the selected chart type
    if (!canvas) {
      console.error(`Canvas with id "${id}" not found`);
      return;
    }
    console.log("Canvas found:", canvas); // Log the canvas element to ensure it was found

    // Clear existing chart instance if any
    if (canvas.chartInstance) {
      console.log("Destroying existing chart instance");
      canvas.chartInstance.destroy();
    }

    const ctx = canvas.getContext("2d");
    const chartData = {
      labels: data.map((item) => item.traineeName),
      datasets: [
        {
          label: "Avg. Attendance",
          data: data.map((item) => item.avgAttendance),

          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    console.log("Creating new chart instance");
    canvas.chartInstance = new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          // Add data labels configuration
          datalabels: {
            display: true,
            color: "#333",
            font: {
              size: 10,
              weight: "bold",
            },
            formatter: function (value) {
              return value; // Display the attendance value directly
            },
          },
        },
      },
      plugins: [ChartDataLabels], // Enable the data labels plugin
    });
  }

  async function getLatestCollection() {
    try {
      const metaDocRef = doc(db, "meta", "collections");
      const metaDocSnapshot = await getDoc(metaDocRef);

      if (metaDocSnapshot.exists()) {
        const metaData = metaDocSnapshot.data();
        const collectionNames = metaData.names;

        if (collectionNames && collectionNames.length > 0) {
          const latestCollectionName =
            collectionNames[collectionNames.length - 1];
          return latestCollectionName;
        } else {
          console.log("No collections found in meta.");
          return null;
        }
      } else {
        console.log("Meta document does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching the latest collection name:", error);
      return null;
    }
  }
  //   async function createEvaluationTable(data, id) {
  //     const tablePosition = document.getElementById(id);
  //     tablePosition.innerHTML = "";
  //     const table = document.createElement("table");
  //     const headerRow = table.insertRow();

  //     // Standard headers
  //     ["Trainee Name", "DU","Avg.Attendance(%)"].forEach((headerText) => {
  //         const th = document.createElement("th");
  //         th.textContent = headerText;
  //         headerRow.appendChild(th);
  //     });

  //     // Collect unique evaluations without "N/A" names or scores
  //     const uniqueEvaluations = new Set();
  //     data.forEach((item) => {
  //         item.evaluations.forEach((evaluation) => {
  //             if (evaluation.evaluationName !== "" && evaluation.evaluationScore !== "N/A") {
  //                 uniqueEvaluations.add(evaluation.evaluationName);
  //             }
  //         });
  //     });

  //     // Create headers for each valid evaluation
  //     const evaluationHeaders = Array.from(uniqueEvaluations);
  //     evaluationHeaders.forEach((header) => {
  //         const th = document.createElement("th");
  //         th.textContent = header;
  //         headerRow.appendChild(th);
  //     });

  //     // Populate table rows
  //     data.forEach((item) => {
  //         const row = table.insertRow();
  //         row.insertCell().textContent = item.traineeName;
  //         row.insertCell().textContent = item.du;
  //         row.insertCell().textContent = item.avgAttendance;

  //         // Map valid evaluations to their scores
  //         const evaluationMap = {};
  //         item.evaluations.forEach((evaluation) => {
  //             if (evaluation.evaluationName !== "N/A" && evaluation.evaluationScore !== "N/A") {
  //                 evaluationMap[evaluation.evaluationName] = evaluation.evaluationScore;
  //             }
  //         });

  //         // Insert cells for each evaluation header, showing score or blank if missing
  //         evaluationHeaders.forEach((header) => {
  //             const cell = row.insertCell();
  //             const score = evaluationMap[header] || "";

  //             // Set cell background color to red if score is 'F'
  //             if (score === 'F') {
  //                 cell.style.backgroundColor = "red";
  //                 cell.style.color = "white"; // Optional: set text color to white for better contrast
  //             }
  //             else if (score.toLowerCase() === 'absent') {
  //               cell.style.backgroundColor = "yellow";
  //               cell.style.color = "black"; // Optional: set text color to black for contrast
  //           }

  //             cell.textContent = score;
  //         });
  //     });

  //     return table;
  // }

  async function createEvaluationTable(data, id) {
    const tablePosition = document.getElementById(id);
    tablePosition.innerHTML = "";

    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";

    // Collect unique evaluations without "N/A" names or scores
    const uniqueEvaluations = new Set();
    data.forEach((item) => {
      item.evaluations.forEach((evaluation) => {
        if (
          evaluation.evaluationName !== "" &&
          evaluation.evaluationScore !== "N/A"
        ) {
          uniqueEvaluations.add(evaluation.evaluationName);
        }
      });
    });

    const evaluationHeaders = Array.from(uniqueEvaluations);
    const hasEvaluations = evaluationHeaders.length > 0;

    if (!hasEvaluations) {
      return null; // 🚫 No evaluations, skip creating table
    }

    // First header row
    const headerRow1 = table.insertRow();

    // Add headers for SI No, Trainee Name, Department
    ["SI No", "Trainee Name", "Department"].forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      // Only use rowspan if we have evaluations
      th.rowSpan = hasEvaluations ? 2 : 1;
      th.style.padding = "8px";
      th.style.border = "1px solid #ddd";
      th.style.textAlign = "center";
      th.style.verticalAlign = "middle";
      headerRow1.appendChild(th);
    });

    // Only add the "Evaluation Details" header if there are evaluations
    if (hasEvaluations) {
      // Add the merged "Evaluation Details" header
      const evaluationDetailsHeader = document.createElement("th");
      evaluationDetailsHeader.textContent = "Evaluation Details";
      evaluationDetailsHeader.colSpan = evaluationHeaders.length;
      evaluationDetailsHeader.style.padding = "8px";
      evaluationDetailsHeader.style.border = "1px solid #ddd";
      evaluationDetailsHeader.style.textAlign = "center";
      headerRow1.appendChild(evaluationDetailsHeader);

      // Second header row for evaluation column names only
      const headerRow2 = table.insertRow();

      // Add individual evaluation headers
      evaluationHeaders.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        th.style.padding = "8px";
        th.style.border = "1px solid #ddd";
        th.style.textAlign = "center";
        headerRow2.appendChild(th);
      });
    }

    // Populate table rows
    data.forEach((item, index) => {
      const row = table.insertRow();

      // Add the serial number (index + 1) as the first cell
      const cell1 = row.insertCell();
      cell1.textContent = index + 1;
      cell1.style.padding = "8px";
      cell1.style.border = "1px solid #ddd";
      cell1.style.textAlign = "center";

      // Add the other standard columns
      const cell2 = row.insertCell();
      cell2.textContent = item.traineeName;
      cell2.style.padding = "8px";
      cell2.style.border = "1px solid #ddd";

      const cell3 = row.insertCell();
      cell3.textContent = item.du;
      cell3.style.padding = "8px";
      cell3.style.border = "1px solid #ddd";
      cell3.style.textAlign = "center";

      // Only add evaluation cells if there are evaluations
      if (hasEvaluations) {
        // Map valid evaluations to their scores
        const evaluationMap = {};
        item.evaluations.forEach((evaluation) => {
          if (
            evaluation.evaluationName !== "N/A" &&
            evaluation.evaluationScore !== "N/A"
          ) {
            evaluationMap[evaluation.evaluationName] =
              evaluation.evaluationScore;
          }
        });

        // Insert cells for each evaluation header, showing score or blank if missing
        evaluationHeaders.forEach((header) => {
          const cell = row.insertCell();
          cell.style.padding = "8px";
          cell.style.border = "1px solid #ddd";
          cell.style.textAlign = "center";
          const score = evaluationMap[header] || "";

          // Set cell background color to red if score is 'F'
          if (score === "F") {
            cell.style.backgroundColor = "red";
            cell.style.color = "white"; // Set text color to white for better contrast
          } else if (score.toLowerCase() === "absent") {
            cell.style.backgroundColor = "yellow";
            cell.style.color = "black"; // Set text color to black for contrast
          }

          cell.textContent = score;
        });
      }
    });

    tablePosition.appendChild(table);
    return table;
  }

  async function createEvaluationTable2(data, id) {
    const tablePosition = document.getElementById(id);
    tablePosition.innerHTML = "";
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";

    // Create header row
    const headerRow = table.insertRow();

    // Add the standard column headers up to "Avg.Attendance"
    const standardHeaders = [
      "SI No",
      "Trainee Name",
      "Department",
      "Avg.Attendance",
    ];
    standardHeaders.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      th.style.padding = "8px";
      headerRow.appendChild(th);
    });

    const evaluationDetailsCell = document.createElement("td");
    evaluationDetailsCell.textContent = "Evaluation Details";

    // Ensure text is exactly vertical and centered
    evaluationDetailsCell.style.writingMode = "sideways-lr"; // Rotate text 90° to face right
    evaluationDetailsCell.style.textAlign = "center"; // Center horizontally
    evaluationDetailsCell.style.verticalAlign = "middle"; // Center vertically
    evaluationDetailsCell.style.width = "20px"; // Adjust width to fit text
    evaluationDetailsCell.style.padding = "0"; // Remove padding for better fit
    evaluationDetailsCell.style.lineHeight = "1"; // Prevent extra spacing
    evaluationDetailsCell.style.fontSize = "12px"; // Set font size
    evaluationDetailsCell.style.overflow = "hidden"; // Prevent any overflow

    // Apply rowspan to span all rows (+1 for header)
    evaluationDetailsCell.rowSpan = data.length + 1;
    headerRow.appendChild(evaluationDetailsCell);

    // Collect unique evaluations without "N/A" names or scores
    const uniqueEvaluations = new Set();
    data.forEach((item) => {
      item.evaluations.forEach((evaluation) => {
        if (
          evaluation.evaluationName !== "" &&
          evaluation.evaluationScore !== "N/A"
        ) {
          uniqueEvaluations.add(evaluation.evaluationName);
        }
      });
    });

    // Create headers for each valid evaluation (after "Evaluation Details")
    const evaluationHeaders = Array.from(uniqueEvaluations);
    evaluationHeaders.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      th.style.padding = "8px";
      headerRow.appendChild(th);
    });

    // Populate table rows
    data.forEach((item, index) => {
      const row = table.insertRow();

      // Add the serial number (index + 1) as the first cell
      row.insertCell().textContent = index + 1;

      // Add the other standard columns
      row.insertCell().textContent = item.traineeName;
      row.insertCell().textContent = item.du;
      row.insertCell().textContent = item.avgAttendance;

      // Skip adding a cell for "Evaluation Details" since it's already spanned

      // Map valid evaluations to their scores
      const evaluationMap = {};
      item.evaluations.forEach((evaluation) => {
        if (
          evaluation.evaluationName !== "N/A" &&
          evaluation.evaluationScore !== "N/A"
        ) {
          evaluationMap[evaluation.evaluationName] = evaluation.evaluationScore;
        }
      });

      // Insert cells for each evaluation header, showing score or blank if missing
      evaluationHeaders.forEach((header) => {
        const cell = row.insertCell();
        const score = evaluationMap[header] || "";

        // Set cell background color to red if score is 'F'
        if (score === "F") {
          cell.style.backgroundColor = "red";
          cell.style.color = "white";
        } else if (score.toLowerCase() === "absent") {
          cell.style.backgroundColor = "yellow";
          cell.style.color = "black";
        }

        cell.textContent = score;
      });
    });

    // Adjust the height of the "Evaluation Details" cell to match the table
    evaluationDetailsCell.style.height = `${table.offsetHeight}px`;

    tablePosition.appendChild(table);
    return table;
  }

  function formatCollectionName(collectionName) {
    const [month, year] = collectionName.split("-");
    return month.charAt(0).toUpperCase() + month.slice(1) + " " + year;
  }

  async function getBatchTraineeCounts() {
    try {
      const collectionName = await getLatestCollection(); // Get the latest collection name
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);

      // Create a map to count trainees per batch
      const batchCounts = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const batchName = data.batchName;

        // Check if batchName exists before counting
        if (batchName) {
          batchCounts[batchName] = (batchCounts[batchName] || 0) + 1;
        } else {
          console.warn("Document missing batchName field:", doc.id);
        }
      });

      return batchCounts;
    } catch (error) {
      console.error("Error fetching trainee counts:", error);
      return null;
    }
  }

  async function generateTraineeDoughnutChart(
    id,
    chartType = "line",
    backgroundColor = "rgba(75, 192, 192, 0.2)",
    borderColor = "rgba(75, 192, 192, 1)"
  ) {
    // Fetch the batch trainee counts
    const batchCounts = await getBatchTraineeCounts();
    if (!batchCounts) {
      console.error("No batch data available for the chart.");
      return;
    }

    // Extract batch names and trainee counts
    const batchNames = Object.keys(batchCounts);
    const traineeCounts = Object.values(batchCounts);

    // Get the context of the canvas element
    const ctx = document.getElementById(id).getContext("2d");

    new Chart(ctx, {
      type: chartType, // Use the specified chart type
      data: {
        labels: batchNames, // Labels for the x-axis
        datasets: [
          {
            label: "Number of Trainees", // Dataset label
            data: traineeCounts, // Data for the chart
            backgroundColor: backgroundColor, // Background color
            borderColor: borderColor, // Border color
            borderWidth: 2, // Line width
            fill: true, // Fill the area for line/area chart
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              // text: 'Batch Name',
              color: "#333",
              font: { size: 12, weight: "bold" },
            },
          },
          y: {
            beginAtZero: true, // Start the y-axis at zero
            title: {
              display: true,
              text: "No of Trainees", // Y-axis title
              color: "#333",
              font: { size: 12, weight: "bold" },
            },
          },
        },
        plugins: {
          legend: {
            position: "top", // Position of the legend
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw; // Get the trainee count
                return `${label}: ${value} trainees`; // Tooltip label
              },
            },
          },
          datalabels: {
            color: "#444", // Color of the labels
            anchor: "end", // Position the labels at the end of points/lines
            align: "start", // Align the labels to the start of points
            formatter: (value) => {
              return value; // Display the value as a label
            },
          },
        },
      },
      plugins: [ChartDataLabels], // Register the data labels plugin
    });
  }

  let currentChartInstance; // Global variable to track the current chart instance
  let debounceTimeout; // Timeout for debouncing

  async function generateTraineePieChart(
    id,
    chartType = "line",
    backgroundColor = "rgba(75, 192, 192, 0.2)",
    borderColor = "rgba(75, 192, 192, 1)"
  ) {
    console.log(`Generating ${chartType} chart...`); // Log chart type

    // Clear previous debounce timeout if it exists
    if (debounceTimeout) clearTimeout(debounceTimeout);

    // Debounce chart rendering by a small delay (e.g., 300 ms)
    debounceTimeout = setTimeout(async () => {
      // Fetch the batch trainee counts
      const batchCounts = await getBatchTraineeCounts();
      console.log("Batch counts:", batchCounts); // Log batch counts to verify data

      if (!batchCounts) {
        console.error("No batch data available for the chart.");
        return;
      }

      // Extract batch names and trainee counts
      const batchNames = Object.keys(batchCounts);
      const traineeCounts = Object.values(batchCounts);

      // Get the context of the canvas element
      const canvas = document.getElementById(id);
      const ctx = canvas.getContext("2d");
      const sequentialNumbers = batchNames.map((_, index) => index + 1);
      // Destroy the previous chart instance if it exists to avoid overlap
      if (currentChartInstance) {
        console.log("Destroying previous chart instance.");
        currentChartInstance.destroy();
      }

      // Create the new chart instance
      currentChartInstance = new Chart(ctx, {
        type: chartType, // Use specified chart type
        data: {
          labels: sequentialNumbers,
          datasets: [
            {
              label: "No of Trainees",
              data: traineeCounts,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Batches",
                color: "#333",
                font: { size: 12, weight: "bold" },
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "No of Trainees",
                color: "#333",
                font: { size: 12, weight: "bold" },
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.raw;
                  return `${label}: ${value} trainees`;
                },
              },
            },
            datalabels: {
              color: "#444",
              anchor: "end",
              align: "start",
              formatter: (value) => value,
            },
          },
        },
        plugins: [ChartDataLabels],
      });
    }, 300); // Debounce delay
  }

  async function getBatchDetailsFromLatestCollection() {
    try {
      // Fetch the latest collection name
      const latestCollectionName = await getLatestCollection();
      if (!latestCollectionName) {
        console.error("No latest collection name found.");
        return;
      }

      // Reference the latest collection
      const traineesCollection = collection(db, latestCollectionName);
      const snapshot = await getDocs(traineesCollection);

      // Initialize an object to store batch details
      const batchDetails = {};

      // Process each trainee document
      snapshot.forEach((doc) => {
        const trainee = doc.data();
        const batchName = trainee.batchName;

        // If this batch is not yet in batchDetails, initialize it
        if (!batchDetails[batchName]) {
          batchDetails[batchName] = {
            numberOfTrainees: 0,
            batchDurationTillDate: trainee.batchDurationTillDate || "N/A",
            certificationLevel: trainee.certificationLevel || "N/A",
            numberOfSessionsTillDate: trainee.numberOfSessionsTillDate || "N/A",
            batchDurationMonth: trainee.batchDurationMonth || "N/A",
            numberOfSessionsMonth: trainee.numberOfSessionsMonth || "N/A",
            trainerName: trainee.trainerName || "N/A", // Set trainer name only once
          };
        }

        // Increment the trainee count for the batch
        batchDetails[batchName].numberOfTrainees += 1;
      });

      // Log or return the batch details
      console.log(batchDetails);
      return batchDetails;
    } catch (error) {
      console.error(
        "Error fetching batch details from latest collection:",
        error
      );
      // alert("Failed to load batch details from the latest collection.");
      showAlert("Failed to load batch details from the latest collection.");
    }
  }

  function renderTotalSessionProgressBars(
    batchDetails,
    sessionTillDateId,
    batchDurationId,
    sessionDurationId,
    selectedBatch
  ) {
    const batchSessionContainer = document.getElementById(sessionTillDateId); // Assume there's a container for the progress bars
    const batchDurationContainer = document.getElementById(batchDurationId);
    const sessionDurationContainer = document.getElementById(sessionDurationId);
    // Clear existing content
    batchSessionContainer.innerHTML = "";
    batchDurationContainer.innerHTML = "";
    sessionDurationContainer.innerHTML = "";

    // Create progress bars for each batch

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const {
        numberOfSessionsTillDate,
        batchDurationTillDate,
        numberOfSessionsMonth,
        batchDurationMonth,
      } = details;
      const progressBarHTML = `
            <div class="progress">
                <div class="progress-bar" id="progress-bar-no-of-sessions"><h3 >${batchName} - ${numberOfSessionsTillDate} Sessions</h3></div>
            </div>
    `;
      batchSessionContainer.innerHTML += progressBarHTML;

      const batchDurationTilldateHTML = `
    <div class="progress">
        <div class="progress-bar" id="progress-bar-duration-till"><h3 >${batchName} - ${batchDurationTillDate} </h3></div>
    </div>
`;
      batchDurationContainer.innerHTML += batchDurationTilldateHTML;

      if (batchName === selectedBatch) {
        const sessionDurationHTML = `
        <div class="progress">
            <div class="progress-bar id="progress-bar-duration-month"><h3>Total Duration: ${batchDurationMonth} hrs</h3></div>
        </div>
        <div class="progress">
        <div class="progress-bar" id="progress-bar-session-month"><h3 >Total Sessions: ${numberOfSessionsMonth} </h3></div>
        </div>
        `;
        sessionDurationContainer.innerHTML += sessionDurationHTML;
      }
    }
  }

  function renderTotalSessionsAndDuration(
    batchDetails,
    sessionTillDateId,
    batchDurationId
  ) {
    const batchSessionContainer = document.getElementById(sessionTillDateId); // Assume there's a container for the progress bars
    const batchDurationContainer = document.getElementById(batchDurationId);
    // Clear existing content
    batchSessionContainer.innerHTML = "";
    batchDurationContainer.innerHTML = "";

    // Create progress bars for each batch

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const { numberOfSessionsTillDate, batchDurationTillDate } = details;
      const progressBarHTML = `
            <div class="progress">
                <div class="progress-bar" id="progress-bar-no-of-sessions"><h3 >${batchName} - ${numberOfSessionsTillDate} Sessions</h3></div>
            </div>
    `;
      batchSessionContainer.innerHTML += progressBarHTML;

      const batchDurationTilldateHTML = `
    <div class="progress">
        <div class="progress-bar" id="progress-bar-duration-till"><h3 >${batchName} - ${batchDurationTillDate} </h3></div>
    </div>
`;
      batchDurationContainer.innerHTML += batchDurationTilldateHTML;
    }
  }

  let sessionChartInstance = null; // Global variable to hold chart instance

  async function generateSessionDurationChart(data, id, chartType) {
    const canvas = document.getElementById(id);
    if (!canvas) {
      console.error(`Canvas with id "${id}" not found`);
      return;
    }

    // Destroy the existing chart instance if it exists
    if (sessionChartInstance) {
      sessionChartInstance.destroy();
    }

    const ctx = canvas.getContext("2d");

    // Extract batch details from the data object
    const batchNames = Object.keys(data); // Extracts the batch names as an array
    const batchDurations = batchNames.map(
      (batch) => data[batch].batchDurationTillDate
    ); // Extracts the durations

    const chartData = {
      labels: batchNames,
      datasets: [
        {
          label: "Total Duration (Hours)",
          data: batchDurations,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    // Create new chart instance and store it in the global chartInstance variable
    sessionChartInstance = new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 250,
            title: {
              display: true,
              text: "Duration (Hours )",
              color: "#333",
              font: { size: 12, weight: "bold" },
            },
          },
          x: {
            title: {
              display: false,
              text: "Batches",
              color: "#333",
              font: { size: 12, weight: "bold" },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            position: "top",
          },
          datalabels: {
            anchor: "end",
            align: "top",
            color: "#333",
            font: {
              weight: "bold",
            },
            formatter: function (value) {
              return value;
            },
          },
        },
      },
      plugins: [ChartDataLabels], // Include the ChartDataLabels plugin
    });
  }

  function renderBatchAttendanceChart(batchData) {
    const batchNames = Object.keys(batchData);
    const avgAttendances = batchNames.map((batchName) => {
      const details = batchData[batchName];
      return details.totalAttendance / details.trainees.length;
    });

    const ctx = document
      .getElementById("attendance-body-graph-template1")
      .getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: batchNames,
        datasets: [
          {
            label: "Average Attendance by Batch (%)",
            data: avgAttendances,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
      },
    });
  }

  async function getBatchFromLatestCollection() {
    try {
      const latestCollectionName = await getLatestCollection();
      if (!latestCollectionName) {
        console.error("No latest collection name found.");
        return;
      }

      const traineesCollection = collection(db, latestCollectionName);
      const snapshot = await getDocs(traineesCollection);

      const batchDetails = {};

      snapshot.forEach((doc) => {
        const trainee = doc.data();
        const batchName = trainee.batchName;

        // Log the entire trainee object to verify its structure
        console.log(`Trainee data:`, trainee);

        // Ensure avgAttendance is a number and default to 0 if NaN
        const avgAttendance = parseFloat(trainee.avgAttendance) || 0;
        console.log(
          `Trainee's average attendance for ${batchName}: ${avgAttendance}`
        ); // Log the avgAttendance

        // If this batch is not yet in batchDetails, initialize it
        if (!batchDetails[batchName]) {
          batchDetails[batchName] = {
            numberOfTrainees: 0,
            totalAttendance: 0,
          };
        }

        // Increment the trainee count and add their attendance to the total
        batchDetails[batchName].numberOfTrainees += 1;
        batchDetails[batchName].totalAttendance += avgAttendance; // Sum the attendance
      });

      // Calculate average attendance for each batch
      for (const batchName in batchDetails) {
        const batch = batchDetails[batchName];
        if (batch.numberOfTrainees > 0) {
          batch.averageAttendance =
            batch.totalAttendance / batch.numberOfTrainees;
        } else {
          batch.averageAttendance = 0; // Set to 0 if there are no trainees
        }
        console.log(
          `Final average attendance for ${batchName}: ${batch.averageAttendance}`
        ); // Log final average
      }

      console.log(batchDetails); // Log the final batch details
      return batchDetails;
    } catch (error) {
      console.error(
        "Error fetching batch details from latest collection:",
        error
      );
      // alert("Failed to load batch details from the latest collection.");
      showAlert("Failed to load batch details from the latest collection.");
    }
  }

  async function getBatchDataForChart(id) {
    const batchDetails = await getBatchFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const labels = [];
    const avgAttendanceData = [];

    // Iterate over the batchDetails to populate labels and data
    for (const batchName in batchDetails) {
      const details = batchDetails[batchName];
      labels.push(batchName);
      avgAttendanceData.push(details.averageAttendance || 0); // Use averageAttendance
    }

    console.log("Labels:", labels);
    console.log("Average Attendance Data:", avgAttendanceData);

    generateChartWithBatchData(labels, avgAttendanceData, id);
  }

  // Function to generate the chart

  function generateChartWithBatchData(labels, data, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error(`Canvas with id "${canvasId}" not found.`);
      return;
    }

    const ctx = canvas.getContext("2d");

    // Destroy existing chart instance if present to prevent overlap
    if (canvas.chartInstance) {
      canvas.chartInstance.destroy();
    }

    canvas.chartInstance = new Chart(ctx, {
      type: "line", // Change to 'line', 'doughnut', etc., as needed
      data: {
        labels: labels,
        datasets: [
          {
            label: "Average Attendance",
            data: data,
            backgroundColor: "rgba(75, 192, 192, 0.5)", // Customize as needed
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          datalabels: {
            display: true,
            align: "top",
            anchor: "end",
            color: "#333",
            formatter: (value) => `${value}%`, // Format to display "value%" on each label
          },
        },
      },
      plugins: [ChartDataLabels], // Ensure ChartDataLabels plugin is included
    });
  }

  async function loadAndDisplayBatchDetails(
    sessionTillDateId,
    batchDurationId,
    sessionDurationId,
    selectedBatch
  ) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (batchDetails) {
      renderTotalSessionProgressBars(
        batchDetails,
        sessionTillDateId,
        batchDurationId,
        sessionDurationId,
        selectedBatch
      );
    }
  }

  async function loadSessionsAndDurationWholeBatch(
    sessionTillDateId,
    batchDurationId
  ) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (batchDetails) {
      renderTotalSessionsAndDuration(
        batchDetails,
        sessionTillDateId,
        batchDurationId
      );
    }
  }

  function renderCertificationLevelChart(
    batchData,
    chartElementId,
    backgroundColor,
    borderColor,
    chartType = "bar"
  ) {
    if (!Array.isArray(batchData) || batchData.length === 0) {
      console.error(
        "Invalid or empty batch data provided to renderCertificationLevelChart."
      );
      return;
    }

    const certificationLevelsMap = {
      N1: 5,
      N2: 4,
      N3: 3,
      N4: 2,
      N5: 1,
    };

    const reverseCertificationMap = {
      5: "N1",
      4: "N2",
      3: "N3",
      2: "N4",
      1: "N5",
    };

    const batchNames = batchData.map((batch) => batch.batchName);
    const certificationLevels = batchData.map(
      (batch) => certificationLevelsMap[batch.certificationLevel]
    );

    if (window.certificationChart) {
      window.certificationChart.destroy();
    }

    const ctx = document.getElementById(chartElementId).getContext("2d");
    window.certificationChart = new Chart(ctx, {
      type: chartType,
      data: {
        labels: batchNames,
        datasets: [
          {
            label: "Current Learning Level",
            font: { size: 13, weight: "bold" },
            data: certificationLevels,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: chartType === "bar" ? "x" : undefined,
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              callback: function (value) {
                return reverseCertificationMap[value] || value;
              },
              color: "#333",
            },
            title: {
              display: false,
              text: "Certification Level",
              color: "#333",
              font: { size: 10, weight: "bold" },
            },
          },
          x: {
            title: {
              display: false,
              text: "Batches",
              color: "#333",
              font: { size: 8, weight: "bold" },
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#333",
              font: { size: 8, weight: "bold" },
            },
          },
          datalabels: {
            display: true,
            color: "#333",
            font: { size: 8, weight: "bold" },
            align: "center",
            formatter: function (value) {
              return reverseCertificationMap[value];
            },
          },
        },
      },
      plugins: [ChartDataLabels], // Enable the datalabels plugin
    });
  }

  async function initCertificationChart(
    chartElementId,
    backgroundColor,
    borderColor,
    selectedChartType
  ) {
    // Fetch batch details
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    console.log("Batch Details:", batchDetails);

    // Map batch data to a format usable by the chart
    const batchDataArray = Object.entries(batchDetails).map(
      ([batchName, details]) => ({
        batchName,
        certificationLevel: details.certificationLevel,
      })
    );

    // Check if the batch data array is empty
    if (batchDataArray.length === 0) {
      console.error("No batch data available to render chart.");
      return;
    }

    renderCertificationLevelChart(
      batchDataArray,
      chartElementId,
      backgroundColor,
      borderColor,
      selectedChartType
    );
  }

  async function initTrainerDetails(chartElementId) {
    // Fetch batch details
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    // Log the batch details to inspect the structure
    console.log("Batch Details:", batchDetails);

    const batchDataArray = Object.entries(batchDetails).map(
      ([batchName, details]) => ({
        batchName,
        trainerName: details.trainerName, // Ensure you have this field
      })
    );

    // Check if the batch data array is empty
    if (batchDataArray.length === 0) {
      console.error("No batch data available to render chart.");
      return;
    }

    // Render the chart
    displayTrainers(batchDataArray, chartElementId);
  }

  function displayTrainers(batchDetails, id) {
    const trainerContainer = document.getElementById(id); // Assume you have a container in your HTML

    // Clear the container first
    trainerContainer.innerHTML = "";

    const trainerNames = batchDetails[0].trainerName;

    if (Array.isArray(trainerNames)) {
      trainerNames.forEach((trainer) => {
        const trainerLine = document.createElement("h3");
        trainerLine.textContent = `${trainer}`;
        trainerContainer.appendChild(trainerLine);
      });
    } else {
      // In case trainerName is not an array, handle accordingly
      const trainerLine = document.createElement("h3");
      trainerLine.textContent = `Trainer for ${batch}: ${trainerNames}`;
      trainerContainer.appendChild(trainerLine);
    }
  }
  async function getNofBatches() {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }
    const numberOfBatches = Object.keys(batchDetails).length;
    return numberOfBatches;
  }

  async function getTraineeDetailsFromLatestCollection() {
    try {
      const latestCollectionName = await getLatestCollection();
      if (!latestCollectionName) {
        console.error("No latest collection name found.");
        return [];
      }

      const traineesCollection = collection(db, latestCollectionName);
      const snapshot = await getDocs(traineesCollection);
      const traineeDetails = [];

      snapshot.forEach((doc) => {
        const trainee = doc.data();

        // Create an object for each trainee with necessary details
        traineeDetails.push({
          traineeName: trainee.traineeName, // Trainee Name
          du: trainee.du || "N/A", // DU (Default to "N/A" if not available)
          avgAttendance: parseFloat(trainee.avgAttendance) || 0, // Average Attendance (ensure it's a number)
          evaluations: trainee.evaluations || [], // Evaluations array
          batchName: trainee.batchName || "N/A",
        });
      });

      return traineeDetails; // Return the collected trainee details
    } catch (error) {
      console.error("Error fetching trainee details:", error);
      // alert("Failed to load trainee details.");
      showAlert("Failed to load trainee details.");
      return [];
    }
  }

  async function populateBatchDataTemplate2(currentDate) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    console.log("ggggggggbatchdetails", batchDetails);

    const mainContainer = document.getElementById("batchwise-data-template2");
    mainContainer.innerHTML = "";

    const numberOfBatches = Object.keys(batchDetails).length;

    const numberOfTrainees = document.getElementById("learnersChart");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart",
      "line",
      backgroundColor,
      borderColor
    );

    initCertificationChart("levelChart", backgroundColor, borderColor, "bar");

    // loadSessionsAndDurationWholeBatch("sessionsChart","batchDurationChart");
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart", "pie");

    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart",
          selectedChartType
        );
      });

    generateSessionChart(batchDetailsData, "sessionsChart", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template2");

    const batchCountDisplay = document.getElementById("number");
    batchCountDisplay.textContent = numberOfBatches;

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    const template1Header = document.getElementById("template2-month");
    template1Header.textContent = formatCollectionName(currentDate);

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);
      console.log("gggggggg", filteredData);

      const batchContainer = document.createElement("div");
      batchContainer.classList.add("batchwise-data-template2");

      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue; // Skip this iteration
      }

      batchContainer.innerHTML = `
            <div class="batch-info">
            <p>Total Sessions: ${numberOfSessionsMonth} </p>
                <h1>${batchName}</h1>
            <p>Total Duration: ${batchDurationMonth} hrs</p>    
            </div>
       
                   
                    <div class="attendance-template2">
                        <h3>Attendance</h3>
                        <canvas id="attendanceChart-${batchName}" width="250" height="70"></canvas>
                    </div>
           
            <div class="trainee-evaluation-template2" id="trainee-table-${batchName}">
            <h3>Evaluation Details</h3>
                <div id="evaluation-table-${batchName}"></div>
            </div>
        `;

      mainContainer.appendChild(batchContainer);

      const evaluationTable1 = document.getElementById(
        `evaluation-table-${batchName}`
      );
      const table1 = await createEvaluationTable(
        filteredData,
        `evaluation-table-${batchName}`
      );
      if (table1 && table1.querySelectorAll("th").length > 3) {
        evaluationTable1.appendChild(table1);
        mainContainer.appendChild(batchContainer);
      } else {
        console.log(`No evaluation data for ${batchName}, skipping render.`);
        document.getElementById(`trainee-table-${batchName}`).style.display =
          "none";
      }

      // await getAttendanceData(filteredData, `attendanceChart-${batchName}`);
      await generateChartToggle(
        filteredData,
        `attendanceChart-${batchName}`,
        "bar"
      );
      document
        .getElementById("chartTypeDropdownAttendance")
        .addEventListener("change", (event) => {
          const selectedChartType = event.target.value;
          generateChartToggle(
            filteredData,
            `attendanceChart-${batchName}`,
            selectedChartType
          );
        });

      // const traineeDetailsTemplate2 = document.getElementById(
      //   `trainee-details-${batchName}`
      // );
      // const traineeTable2 = await getTraineeDetails(
      //   filteredData,
      //   `trainee-details-${batchName}`
      // ); // Call your attendance data function
      // traineeDetailsTemplate2.appendChild(traineeTable2);
    }
  }

  async function createAllBatchEvaluationTabletemplate1(data, id) {
    const tablePosition = document.getElementById(id);
    tablePosition.innerHTML = ""; // Clear existing content

    // Create the table element
    const table = document.createElement("table");
    table.style.border = "1";

    // Create the header row
    const headerRow = table.insertRow();
    ["Trainee Name", "Batch Name", "DU"].forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    // Get unique evaluation names for the headers
    const uniqueEvaluations = new Set();
    data.forEach((item) => {
      item.evaluations.forEach((evaluation) => {
        if (evaluation.evaluationName !== "N/A") {
          uniqueEvaluations.add(evaluation.evaluationName);
        }
      });
    });

    // Create headers for each unique evaluation
    const evaluationHeaders = Array.from(uniqueEvaluations);
    evaluationHeaders.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header; // Set header text
      headerRow.appendChild(th); // Append header to the header row
    });

    // Append the header row to the table
    table.appendChild(headerRow);

    // Create rows for each trainee
    data.forEach((item) => {
      const row = table.insertRow();
      row.insertCell().textContent = item.traineeName; // Insert trainee name
      row.insertCell().textContent = item.batchName;
      row.insertCell().textContent = item.du; // Insert DU

      // Create a map for evaluations
      const evaluationMap = {};
      item.evaluations.forEach((evaluation) => {
        if (evaluation.evaluationName !== "N/A") {
          evaluationMap[evaluation.evaluationName] = evaluation.evaluationScore; // Map evaluation names to scores
        }
      });

      // Insert evaluation scores into the table
      evaluationHeaders.forEach((header) => {
        const cell = row.insertCell();
        cell.textContent = evaluationMap[header] || ""; // Use the score if available, else leave blank
      });
    });

    // Append the created table to the specified position in the DOM
    tablePosition.appendChild(table);
  }

  let chartInstance = null;

  async function generateSessionChart(data, id, chartType) {
    const canvas = document.getElementById(id);
    if (!canvas) {
      console.error(`Canvas with id "${id}" not found`);
      return;
    }

    // Destroy existing chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = canvas.getContext("2d");

    // Prepare data for chart
    const batchNames = Object.keys(data);
    const batchDurations = batchNames.map(
      (batch) => data[batch].numberOfSessionsTillDate
    );
    const sequentialNumbers = batchNames.map((_, index) => index + 1);
    const chartData = {
      labels: sequentialNumbers,
      datasets: [
        {
          label: "Total Sessions",
          data: batchDurations,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    // Create new chart instance and assign it to chartInstance variable
    chartInstance = new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 250,
            title: {
              display: true,
              text: "Sessions",
              color: "#000000",
            },
            font: { size: 10, weight: "bold" },
          },
          x: {
            title: {
              display: true,
              text: "Batches ",
              color: "#000000",
            },
            font: { size: 10, weight: "bold" },
          },
        },
        plugins: {
          legend: {
            display: false,
            position: "bottom",
          },
          datalabels: {
            display: true,
            align: "bottom",
            anchor: "end",
            color: "#000000",
            formatter: function (value) {
              return value;
            },
          },
        },
      },
      plugins: [ChartDataLabels], // Ensure ChartDataLabels plugin is included
    });
  }

  async function populateBatchDataTemplate1(currentDate) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    const batchCountDisplay = document.getElementById(
      "number-of-Batch-tmeplate3"
    );
    batchCountDisplay.textContent = await getNofBatches();

    initTrainerDetails("trainer-name-template1");

    const numberOfTrainees = document.getElementById("card-content");
    const template1Header = document.getElementById("header-template1-h3");
    template1Header.textContent = formatCollectionName(currentDate);

    numberOfTrainees.textContent = generateTraineePieChart(
      "trainee-piechart-template1",
      "line",
      backgroundColor,
      borderColor
    );

    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    initCertificationChart(
      "certificationBarChart",
      backgroundColor,
      borderColor,
      "bar"
    );

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "trainee-piechart-template1",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });

    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "certificationBarChart",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });

    const cutoffContainer = document.getElementById(
      "whole-batch-cutoff-container"
    );
    cutoffContainer.innerHTML = "";

    const rightContainer = document.getElementById("right-template1");
    if (rightContainer) {
      rightContainer.innerHTML = `
           
            <div class="current-level-template1">
                      <div class="level-heading" id="level-heading">
                        <p>Current Learning Level</p>
                      </div>
                      <div class="inner-level-template1">
                        <canvas id="certificationBarChart" width="300" height="200"></canvas>                    
                      </div>
                    </div>
                    <div class="batch-duration-template1">
                      <div class="duration-heading-template1" id="duration-heading-template1">
                        <p>Total Batch Duration</p>
                      </div>
                      <div class="duration-body-template1">
                        <canvas id="whole-duration-data-templae1"  width="250" height="190" ></canvas>
                      </div>
                    </div>
            <div class="attendance-template1">
                <div class="attendance-heading-template1" id="attendance-heading-template1">
                    <p>Average Attendance</p>
                </div>
                <div class="attendance-body-template1">
                    <canvas id="attendance-body-graph-template1" hight="100" width="100"></canvas>
                </div>
            </div>`;
    }
    generateSessionDurationChart(
      batchDetailsData,
      "whole-duration-data-templae1",
      "pie"
    );
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "whole-duration-data-templae1",
          selectedChartType
        );
      });
    generateSessionChart(
      batchDetailsData,
      "progressBarsContainer-templae1",
      "pie"
    );
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "progressBarsContainer-templae1",
          selectedChartType
        );
      });
    getBatchDataForChart("attendance-body-graph-template1");

    const bottomContainer = document.getElementById("bottum-cutoff-template1");
    if (!bottomContainer) {
      console.error("Bottom container not found.");
      return;
    }

    bottomContainer.innerHTML = ""; // Clear any previous content

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);
      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue;
      }
      const batchDiv = document.createElement("div");
      batchDiv.className = "single-batch-info-template1";
      batchDiv.id = `single-batch-info-template1-${batchName}`;
      // Generate HTML for each batch and append it to the bottom container
      batchDiv.innerHTML = `
            <div class="single-batch-info-template1" id="single-batch-info-template1-${batchName}">
                <div class="single-batch-info-heading-template1" id="single-batch-info-heading-template1">
                    <h1 id="batch-name-template1-${batchName}">${batchName}</h1>
                </div>
                <div class="single-batch-info-body-template1">
                    <div id="single-info-table-template1-${batchName}">
                        <div class="single-batch-template1-left">
                            <div class="single-batch-trainee-details-template1">
                                <div class="single-batch-trainee-heading-template1" >
                                    <p>Evaluation Details</p>
                                </div>
                                <div class="single-batch-trainee-body-template1" id="single-batch-trainee-body-template1">
                                    <div id="single-batch-trainee-content-template1-${batchName}"></div>
                                </div>
                            </div>
                            <div class="single-batch-template1-right">
                                <div class="single-batch-sessionDuration-details-template1">
                                    <div class="single-batch-sessionDuration-heading-template1" id="single-batch-sessionDuration-heading-template1">
                                        <p>Sessions and Duration</p>
                                    </div>
                                    <div class="single-batch-sessionDuration-body-template1">
                                        <div id="single-batch-sessionDuration-content-template1-${batchName}">
                                        <h2 class="t3sessions-firsth-template1">Total Sessions: ${numberOfSessionsMonth}</h2>
                                        <h2 class="t3sessions-secondh-template1">Total Duration: ${batchDurationMonth} hrs</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="single-batch-attendance-details-template1">
                                    <div class="single-batch-attendance-heading-template1" id=".single-batch-attendance-heading-template1">
                                        <p>Average Attendance</p>
                                    </div>
                                    <div class="single-batch-attendance-body-template1">
                                        <canvas id="single-batch-attendance-content-template1-${batchName}" hight="300" width="200"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="single-batch-evaluation-details-template1">
                            <div class="single-batch-evaluation-heading-template1">
                                <p>Evaluation Details</p>
                            </div>
                            <div class="single-batch-evaluation-body-template1">
                                <div id="single-batch-evaluation-content-template1-${batchName}"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

      // bottomContainer.innerHTML += batchHtml;
      bottomContainer.appendChild(batchDiv);

      const evaluationTable = document.getElementById(
        `single-batch-evaluation-content-template1-${batchName}`
      );
      const table1 = await createEvaluationTable(
        filteredData,
        `single-batch-evaluation-content-template1-${batchName}`
      );
      evaluationTable.appendChild(table1);

      const traineeDetailsTemplate2 = document.getElementById(
        `single-batch-trainee-content-template1-${batchName}`
      );
      const traineeTable2 = await getTraineeDetails(
        filteredData,
        `single-batch-trainee-content-template1-${batchName}`
      );
      traineeDetailsTemplate2.appendChild(traineeTable2);

      await generateChartToggle(
        filteredData,
        `single-batch-attendance-content-template1-${batchName}`,
        "line"
      );
      document
        .getElementById("chartTypeDropdownAttendance")
        .addEventListener("change", (event) => {
          const selectedChartType = event.target.value;
          generateChartToggle(
            filteredData,
            `single-batch-attendance-content-template1-${batchName}`,
            selectedChartType
          );
        });
    }
  }

  async function populateBatchDataTemplate3(currentDate) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const mainContainer = document.getElementById("batchwise-data-template3");
    mainContainer.innerHTML = ""; // Clear any previous content
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];
    const template1Header = document.getElementById("subtitle");
    template1Header.textContent = formatCollectionName(currentDate);

    const numberOfBatches = Object.keys(batchDetails).length;

    const batchCountDisplay = document.getElementById(
      "number-of-Batch-tmeplate3"
    );
    batchCountDisplay.textContent = await getNofBatches();

    initTrainerDetails("trainers-template3");

    // const backgroundColor2 = 'rgba(153, 102, 255, 0.2)';
    // const borderColor2 = 'rgba(255, 159, 64, 0.2)';

    const numberOfTrainees = document.getElementById("card-content");

    numberOfTrainees.textContent = generateTraineePieChart(
      "card-content",
      "line",
      backgroundColor,
      borderColor
    );
    // loadSessionsAndDurationWholeBatch(
    //   "card-content-sessions",
    //   "card-content-duration"
    // );
    const batchDetailsData = await getBatchDetailsFromLatestCollection();
    generateSessionDurationChart(
      batchDetailsData,
      "card-content-duration",
      "pie"
    );
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "card-content-duration",
          selectedChartType
        );
      });
    generateSessionChart(batchDetailsData, "card-content-sessions", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "card-content-sessions",
          selectedChartType
        );
      });

    initCertificationChart(
      "current-level-template3",
      backgroundColor,
      borderColor,
      "bar"
    );

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "card-content",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "current-level-template3",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });

    batchCountDisplay.textContent = numberOfBatches;

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);

      const batchContainer = document.createElement("div");
      batchContainer.classList.add("batchwise-data-template3");

      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue; // Skip this iteration
      }

      batchContainer.innerHTML = `
            <div class="t3batchname">
            
            <div class="t3sessions">
                <h2 class="t3sessions-firsth">Total Sessions: ${numberOfSessionsMonth}</h2>
                <h3 class="batch-title">${batchName}</h3>
                <h2 class="t3sessions-secondh">Total Duration: ${batchDurationMonth} hrs</h2>
            </div>
        </div>
        <div class="traneediv">
            <div class="democheck">
        
            <div class="t3traineeatt">
                <div class="graph-title-attendance">Trainee Attendance</div>
                <div class="t3graph-attendance">
                <canvas id="t3graph-attendance-${batchName}" width="300" height="100" ></canvas>

                </div
            </div>
            </div>
        </div>
        <div class="eval-table" id="eval-table-${batchName}">
            <div class="table-title">Evaluation Details</div>
            <div class="table-section">
                <div id="evaluation-table-${batchName}" style="width:100%; padding-left:60px;"></div>
            </div>
        </div>
        `;

      mainContainer.appendChild(batchContainer);

      const evaluationTable = document.getElementById(
        `evaluation-table-${batchName}`
      );
      const table1 = await createEvaluationTable(
        filteredData,
        `evaluation-table-${batchName}`
      );
      if (table1 && table1.querySelectorAll("th").length > 3) {
        evaluationTable.appendChild(table1);
        mainContainer.appendChild(batchContainer);
      } else {
        console.log(`No evaluation data for ${batchName}, skipping render.`);
        document.getElementById(`eval-table-${batchName}`).style.display =
          "none";
      }

      // await getAttendanceData(filteredData, `t3graph-attendance-${batchName}`);
      // console.log(filteredData);

      await generateChartToggle(
        filteredData,
        `t3graph-attendance-${batchName}`,
        "bar"
      );
      document
        .getElementById("chartTypeDropdownAttendance")
        .addEventListener("change", (event) => {
          const selectedChartType = event.target.value;
          generateChartToggle(
            filteredData,
            `t3graph-attendance-${batchName}`,
            selectedChartType
          );
        });

      // const traineeDetailsTemplate2 = document.getElementById(
      //   `t3graph-trainee-${batchName}`
      // );
      // const traineeTable2 = await getTraineeDetails(
      //   filteredData,
      //   `t3graph-trainee-${batchName}`
      // );
      // traineeDetailsTemplate2.appendChild(traineeTable2);
    }
  }

  async function populateBatchDataTemplate10(currentDate) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    console.log("ggggggggbatchdetails", batchDetails);

    const mainContainer = document.getElementById("batchwise-data-template-10");
    mainContainer.innerHTML = "";

    const numberOfBatches = Object.keys(batchDetails).length;

    const numberOfTrainees = document.getElementById("learnersChart-10");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-10",
      "line",
      backgroundColor,
      borderColor
    );

    initCertificationChart("levelChart-10", backgroundColor, borderColor, "bar");

    // loadSessionsAndDurationWholeBatch("sessionsChart","batchDurationChart");
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart-10", "pie");

    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-10",
          selectedChartType
        );
      });

    generateSessionChart(batchDetailsData, "sessionsChart-10", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-10",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template-10");

    const batchCountDisplay = document.getElementById("number-10");
    batchCountDisplay.textContent = numberOfBatches;

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-10",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-10",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    const template1Header = document.getElementById("template-10-month");
    template1Header.textContent = formatCollectionName(currentDate);

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);
      console.log("gggggggg", filteredData);

      const batchContainer = document.createElement("div");
      batchContainer.classList.add("batchwise-data-template-10");

      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue; // Skip this iteration
      }

      batchContainer.innerHTML = `
            <div class="batch-info-10">
            <p>Total Sessions: ${numberOfSessionsMonth} </p>
                <h1>${batchName}</h1>
            <p>Total Duration: ${batchDurationMonth} hrs</p>    
            </div>
       
                   
                    <div class="attendance-template-10">
                        <h3>Attendance</h3>
                        <canvas id="attendanceChart-${batchName}" width="250" height="70"></canvas>
                    </div>
           
            <div class="trainee-evaluation-template-10" id="trainee-table-${batchName}">
            <h3>Evaluation Details</h3>
                <div id="evaluation-table-${batchName}"></div>
            </div>
        `;

      mainContainer.appendChild(batchContainer);

      const evaluationTable1 = document.getElementById(
        `evaluation-table-${batchName}`
      );
      const table1 = await createEvaluationTable(
        filteredData,
        `evaluation-table-${batchName}`
      );
      if (table1 && table1.querySelectorAll("th").length > 3) {
        evaluationTable1.appendChild(table1);
        mainContainer.appendChild(batchContainer);
      } else {
        console.log(`No evaluation data for ${batchName}, skipping render.`);
        document.getElementById(`trainee-table-${batchName}`).style.display =
          "none";
      }

      // await getAttendanceData(filteredData, `attendanceChart-${batchName}`);
      await generateChartToggle(
        filteredData,
        `attendanceChart-${batchName}`,
        "bar"
      );
      document
        .getElementById("chartTypeDropdownAttendance")
        .addEventListener("change", (event) => {
          const selectedChartType = event.target.value;
          generateChartToggle(
            filteredData,
            `attendanceChart-${batchName}`,
            selectedChartType
          );
        });

      // const traineeDetailsTemplate2 = document.getElementById(
      //   `trainee-details-${batchName}`
      // );
      // const traineeTable2 = await getTraineeDetails(
      //   filteredData,
      //   `trainee-details-${batchName}`
      // ); // Call your attendance data function
      // traineeDetailsTemplate2.appendChild(traineeTable2);
    }
  }

  async function populateBatchDataTemplate11(currentDate) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    console.log("ggggggggbatchdetails", batchDetails);

    const mainContainer = document.getElementById("batchwise-data-template-11");
    mainContainer.innerHTML = "";

    const numberOfBatches = Object.keys(batchDetails).length;

    const numberOfTrainees = document.getElementById("learnersChart-11");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-11",
      "line",
      backgroundColor,
      borderColor
    );

    initCertificationChart("levelChart-11", backgroundColor, borderColor, "bar");

    // loadSessionsAndDurationWholeBatch("sessionsChart","batchDurationChart");
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart-11", "pie");

    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-11",
          selectedChartType
        );
      });

    generateSessionChart(batchDetailsData, "sessionsChart-11", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-11",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template-11");

    const batchCountDisplay = document.getElementById("number-11");
    batchCountDisplay.textContent = numberOfBatches;

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-11",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-11",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    const template1Header = document.getElementById("template-11-month");
    template1Header.textContent = formatCollectionName(currentDate);

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);
      console.log("gggggggg", filteredData);

      const batchContainer = document.createElement("div");
      batchContainer.classList.add("batchwise-data-template-11");

      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue; // Skip this iteration
      }

      batchContainer.innerHTML = `
            <div class="batch-info-11">
            <p>Total Sessions: ${numberOfSessionsMonth} </p>
                <h1>${batchName}</h1>
            <p>Total Duration: ${batchDurationMonth} hrs</p>    
            </div>
       
                   
                    <div class="attendance-template-11">
                        <h3>Attendance</h3>
                        <canvas id="attendanceChart-${batchName}" width="250" height="70"></canvas>
                    </div>
           
            <div class="trainee-evaluation-template-11" id="trainee-table-${batchName}">
            <h3>Evaluation Details</h3>
                <div id="evaluation-table-${batchName}"></div>
            </div>
        `;

      mainContainer.appendChild(batchContainer);

      const evaluationTable1 = document.getElementById(
        `evaluation-table-${batchName}`
      );
      const table1 = await createEvaluationTable(
        filteredData,
        `evaluation-table-${batchName}`
      );
      if (table1 && table1.querySelectorAll("th").length > 3) {
        evaluationTable1.appendChild(table1);
        mainContainer.appendChild(batchContainer);
      } else {
        console.log(`No evaluation data for ${batchName}, skipping render.`);
        document.getElementById(`trainee-table-${batchName}`).style.display =
          "none";
      }

      // await getAttendanceData(filteredData, `attendanceChart-${batchName}`);
      await generateChartToggle(
        filteredData,
        `attendanceChart-${batchName}`,
        "bar"
      );
      document
        .getElementById("chartTypeDropdownAttendance")
        .addEventListener("change", (event) => {
          const selectedChartType = event.target.value;
          generateChartToggle(
            filteredData,
            `attendanceChart-${batchName}`,
            selectedChartType
          );
        });

      // const traineeDetailsTemplate2 = document.getElementById(
      //   `trainee-details-${batchName}`
      // );
      // const traineeTable2 = await getTraineeDetails(
      //   filteredData,
      //   `trainee-details-${batchName}`
      // ); // Call your attendance data function
      // traineeDetailsTemplate2.appendChild(traineeTable2);
    }
  }


  async function populateBatchDataTemplate12(currentDate) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    console.log("ggggggggbatchdetails", batchDetails);

    const mainContainer = document.getElementById("batchwise-data-template-12");
    mainContainer.innerHTML = "";

    const numberOfBatches = Object.keys(batchDetails).length;

    const numberOfTrainees = document.getElementById("learnersChart-12");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-12",
      "line",
      backgroundColor,
      borderColor
    );

    initCertificationChart("levelChart-12", backgroundColor, borderColor, "bar");

    // loadSessionsAndDurationWholeBatch("sessionsChart","batchDurationChart");
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart-12", "pie");

    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-12",
          selectedChartType
        );
      });

    generateSessionChart(batchDetailsData, "sessionsChart-12", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-12",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template-12");

    const batchCountDisplay = document.getElementById("number-12");
    batchCountDisplay.textContent = numberOfBatches;

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-12",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-12",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    const template1Header = document.getElementById("template-12-month");
    template1Header.textContent = formatCollectionName(currentDate);

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);
      console.log("gggggggg", filteredData);

      const batchContainer = document.createElement("div");
      batchContainer.classList.add("batchwise-data-template-12");

      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue; // Skip this iteration
      }

      batchContainer.innerHTML = `
            <div class="batch-info-12">
            <p>Total Sessions: ${numberOfSessionsMonth} </p>
                <h1>${batchName}</h1>
            <p>Total Duration: ${batchDurationMonth} hrs</p>    
            </div>
       
                   
                    <div class="attendance-template-12">
                        <h3>Attendance</h3>
                        <canvas id="attendanceChart-${batchName}" width="250" height="70"></canvas>
                    </div>
           
            <div class="trainee-evaluation-template-12" id="trainee-table-${batchName}">
            <h3>Evaluation Details</h3>
                <div id="evaluation-table-${batchName}"></div>
            </div>
        `;

      mainContainer.appendChild(batchContainer);

      const evaluationTable1 = document.getElementById(
        `evaluation-table-${batchName}`
      );
      const table1 = await createEvaluationTable(
        filteredData,
        `evaluation-table-${batchName}`
      );
      if (table1 && table1.querySelectorAll("th").length > 3) {
        evaluationTable1.appendChild(table1);
        mainContainer.appendChild(batchContainer);
      } else {
        console.log(`No evaluation data for ${batchName}, skipping render.`);
        document.getElementById(`trainee-table-${batchName}`).style.display =
          "none";
      }

      // await getAttendanceData(filteredData, `attendanceChart-${batchName}`);
      await generateChartToggle(
        filteredData,
        `attendanceChart-${batchName}`,
        "bar"
      );
      document
        .getElementById("chartTypeDropdownAttendance")
        .addEventListener("change", (event) => {
          const selectedChartType = event.target.value;
          generateChartToggle(
            filteredData,
            `attendanceChart-${batchName}`,
            selectedChartType
          );
        });

      // const traineeDetailsTemplate2 = document.getElementById(
      //   `trainee-details-${batchName}`
      // );
      // const traineeTable2 = await getTraineeDetails(
      //   filteredData,
      //   `trainee-details-${batchName}`
      // ); // Call your attendance data function
      // traineeDetailsTemplate2.appendChild(traineeTable2);
    }
  }


  async function populateBatchDataTemplate13(currentDate) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    console.log("ggggggggbatchdetails", batchDetails);

    const mainContainer = document.getElementById("batchwise-data-template-13");
    mainContainer.innerHTML = "";

    const numberOfBatches = Object.keys(batchDetails).length;

    const numberOfTrainees = document.getElementById("learnersChart-13");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-13",
      "line",
      backgroundColor,
      borderColor
    );

    initCertificationChart("levelChart-13", backgroundColor, borderColor, "bar");

    // loadSessionsAndDurationWholeBatch("sessionsChart","batchDurationChart");
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart-13", "pie");

    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-13",
          selectedChartType
        );
      });

    generateSessionChart(batchDetailsData, "sessionsChart-13", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-13",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template-13");

    const batchCountDisplay = document.getElementById("number-13");
    batchCountDisplay.textContent = numberOfBatches;

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-13",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-13",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    const template1Header = document.getElementById("template-13-month");
    template1Header.textContent = formatCollectionName(currentDate);

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);
      console.log("gggggggg", filteredData);

      const batchContainer = document.createElement("div");
      batchContainer.classList.add("batchwise-data-template-13");

      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue; // Skip this iteration
      }

      batchContainer.innerHTML = `
            <div class="batch-info-13">
            <p>Total Sessions: ${numberOfSessionsMonth} </p>
                <h1>${batchName}</h1>
            <p>Total Duration: ${batchDurationMonth} hrs</p>    
            </div>
       
                   
                    <div class="attendance-template-13">
                        <h3>Attendance</h3>
                        <canvas id="attendanceChart-${batchName}" width="250" height="70"></canvas>
                    </div>
           
            <div class="trainee-evaluation-template-13" id="trainee-table-${batchName}">
            <h3>Evaluation Details</h3>
                <div id="evaluation-table-${batchName}"></div>
            </div>
        `;

      mainContainer.appendChild(batchContainer);

      const evaluationTable1 = document.getElementById(
        `evaluation-table-${batchName}`
      );
      const table1 = await createEvaluationTable(
        filteredData,
        `evaluation-table-${batchName}`
      );
      if (table1 && table1.querySelectorAll("th").length > 3) {
        evaluationTable1.appendChild(table1);
        mainContainer.appendChild(batchContainer);
      } else {
        console.log(`No evaluation data for ${batchName}, skipping render.`);
        document.getElementById(`trainee-table-${batchName}`).style.display =
          "none";
      }

      // await getAttendanceData(filteredData, `attendanceChart-${batchName}`);
      await generateChartToggle(
        filteredData,
        `attendanceChart-${batchName}`,
        "bar"
      );
      document
        .getElementById("chartTypeDropdownAttendance")
        .addEventListener("change", (event) => {
          const selectedChartType = event.target.value;
          generateChartToggle(
            filteredData,
            `attendanceChart-${batchName}`,
            selectedChartType
          );
        });

      // const traineeDetailsTemplate2 = document.getElementById(
      //   `trainee-details-${batchName}`
      // );
      // const traineeTable2 = await getTraineeDetails(
      //   filteredData,
      //   `trainee-details-${batchName}`
      // ); // Call your attendance data function
      // traineeDetailsTemplate2.appendChild(traineeTable2);
    }
  }

  async function populateBatchDataTemplate14(currentDate) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    console.log("ggggggggbatchdetails", batchDetails);

    const mainContainer = document.getElementById("batchwise-data-template-14");
    mainContainer.innerHTML = "";

    const numberOfBatches = Object.keys(batchDetails).length;

    const numberOfTrainees = document.getElementById("learnersChart-14");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-14",
      "line",
      backgroundColor,
      borderColor
    );

    initCertificationChart("levelChart-14", backgroundColor, borderColor, "bar");

    // loadSessionsAndDurationWholeBatch("sessionsChart","batchDurationChart");
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart-14", "pie");

    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-14",
          selectedChartType
        );
      });

    generateSessionChart(batchDetailsData, "sessionsChart-14", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-14",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template-14");

    const batchCountDisplay = document.getElementById("number-14");
    batchCountDisplay.textContent = numberOfBatches;

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-14",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-14",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    const template1Header = document.getElementById("template-14-month");
    template1Header.textContent = formatCollectionName(currentDate);

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);
      console.log("gggggggg", filteredData);

      const batchContainer = document.createElement("div");
      batchContainer.classList.add("batchwise-data-template-14");

      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue; // Skip this iteration
      }

      batchContainer.innerHTML = `
            <div class="batch-info-14">
            <p>Total Sessions: ${numberOfSessionsMonth} </p>
                <h1>${batchName}</h1>
            <p>Total Duration: ${batchDurationMonth} hrs</p>    
            </div>
       
                   
                    <div class="attendance-template-14">
                        <h3>Attendance</h3>
                        <canvas id="attendanceChart-${batchName}" width="250" height="70"></canvas>
                    </div>
           
            <div class="trainee-evaluation-template-14" id="trainee-table-${batchName}">
            <h3>Evaluation Details</h3>
                <div id="evaluation-table-${batchName}"></div>
            </div>
        `;

      mainContainer.appendChild(batchContainer);

      const evaluationTable1 = document.getElementById(
        `evaluation-table-${batchName}`
      );
      const table1 = await createEvaluationTable(
        filteredData,
        `evaluation-table-${batchName}`
      );
      if (table1 && table1.querySelectorAll("th").length > 3) {
        evaluationTable1.appendChild(table1);
        mainContainer.appendChild(batchContainer);
      } else {
        console.log(`No evaluation data for ${batchName}, skipping render.`);
        document.getElementById(`trainee-table-${batchName}`).style.display =
          "none";
      }

      // await getAttendanceData(filteredData, `attendanceChart-${batchName}`);
      await generateChartToggle(
        filteredData,
        `attendanceChart-${batchName}`,
        "bar"
      );
      document
        .getElementById("chartTypeDropdownAttendance")
        .addEventListener("change", (event) => {
          const selectedChartType = event.target.value;
          generateChartToggle(
            filteredData,
            `attendanceChart-${batchName}`,
            selectedChartType
          );
        });

      // const traineeDetailsTemplate2 = document.getElementById(
      //   `trainee-details-${batchName}`
      // );
      // const traineeTable2 = await getTraineeDetails(
      //   filteredData,
      //   `trainee-details-${batchName}`
      // ); // Call your attendance data function
      // traineeDetailsTemplate2.appendChild(traineeTable2);
    }
  }


  async function populateBatchDataTemplate15(currentDate) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    console.log("ggggggggbatchdetails", batchDetails);

    const mainContainer = document.getElementById("batchwise-data-template-15");
    mainContainer.innerHTML = "";

    const numberOfBatches = Object.keys(batchDetails).length;

    const numberOfTrainees = document.getElementById("learnersChart-15");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-15",
      "line",
      backgroundColor,
      borderColor
    );

    initCertificationChart("levelChart-15", backgroundColor, borderColor, "bar");

    // loadSessionsAndDurationWholeBatch("sessionsChart","batchDurationChart");
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart-15", "pie");

    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-15",
          selectedChartType
        );
      });

    generateSessionChart(batchDetailsData, "sessionsChart-15", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-15",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template-15");

    const batchCountDisplay = document.getElementById("number-15");
    batchCountDisplay.textContent = numberOfBatches;

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-15",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-15",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    const template1Header = document.getElementById("template-15-month");
    template1Header.textContent = formatCollectionName(currentDate);

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);
      console.log("gggggggg", filteredData);

      const batchContainer = document.createElement("div");
      batchContainer.classList.add("batchwise-data-template-15");

      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue; // Skip this iteration
      }

      batchContainer.innerHTML = `
            <div class="batch-info-15">
            <p>Total Sessions: ${numberOfSessionsMonth} </p>
                <h1>${batchName}</h1>
            <p>Total Duration: ${batchDurationMonth} hrs</p>    
            </div>
       
                   
                    <div class="attendance-template-15">
                        <h3>Attendance</h3>
                        <canvas id="attendanceChart-${batchName}" width="250" height="70"></canvas>
                    </div>
           
            <div class="trainee-evaluation-template-15" id="trainee-table-${batchName}">
            <h3>Evaluation Details</h3>
                <div id="evaluation-table-${batchName}"></div>
            </div>
        `;

      mainContainer.appendChild(batchContainer);

      const evaluationTable1 = document.getElementById(
        `evaluation-table-${batchName}`
      );
      const table1 = await createEvaluationTable(
        filteredData,
        `evaluation-table-${batchName}`
      );
      if (table1 && table1.querySelectorAll("th").length > 3) {
        evaluationTable1.appendChild(table1);
        mainContainer.appendChild(batchContainer);
      } else {
        console.log(`No evaluation data for ${batchName}, skipping render.`);
        document.getElementById(`trainee-table-${batchName}`).style.display =
          "none";
      }

      // await getAttendanceData(filteredData, `attendanceChart-${batchName}`);
      await generateChartToggle(
        filteredData,
        `attendanceChart-${batchName}`,
        "bar"
      );
      document
        .getElementById("chartTypeDropdownAttendance")
        .addEventListener("change", (event) => {
          const selectedChartType = event.target.value;
          generateChartToggle(
            filteredData,
            `attendanceChart-${batchName}`,
            selectedChartType
          );
        });

      // const traineeDetailsTemplate2 = document.getElementById(
      //   `trainee-details-${batchName}`
      // );
      // const traineeTable2 = await getTraineeDetails(
      //   filteredData,
      //   `trainee-details-${batchName}`
      // ); // Call your attendance data function
      // traineeDetailsTemplate2.appendChild(traineeTable2);
    }
  }


  async function populateBatchDataCustomTemplate(currentDate) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const mainContainer = document.getElementById(
      "batchwise-data-custom-template"
    );
    mainContainer.innerHTML = "";

    const numberOfBatches = Object.keys(batchDetails).length;

    const numberOfTrainees = document.getElementById("learnersChart-custom");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-custom",
      "line",
      backgroundColor,
      borderColor
    );

    initCertificationChart(
      "levelChart-custom",
      backgroundColor,
      borderColor,
      "bar"
    );

    // loadSessionsAndDurationWholeBatch("sessionsChart","batchDurationChart");
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(
      batchDetailsData,
      "batchDurationChart-custom",
      "pie"
    );

    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-custom",
          selectedChartType
        );
      });

    generateSessionChart(batchDetailsData, "sessionsChart-custom", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-custom",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-custom-template");

    const batchCountDisplay = document.getElementById("number-custom");
    batchCountDisplay.textContent = numberOfBatches;

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-custom",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-custom",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    const template1Header = document.getElementById("custom-template-month");
    template1Header.textContent = formatCollectionName(currentDate);

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);

      const batchContainer = document.createElement("div");
      batchContainer.classList.add("batchwise-data-custom-template");

      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue; // Skip this iteration
      }

      batchContainer.innerHTML = `
          <div class="batch-info-custom">
          <p>Total Sessions: ${numberOfSessionsMonth} </p>
              <h1>${batchName}</h1>
          <p>Total Duration: ${batchDurationMonth} hrs</p>    
          </div>
     
                 
                  <div class="attendance-custom-template">
                      <h3>Attendance</h3>
                      <canvas id="attendanceChart-${batchName}" width="250" height="70"></canvas>
                  </div>
         
          <div class="trainee-evaluation-custom-template" id="trainee-evaluation-custom-template-${batchName}">
          <h3>Evaluation Details</h3>
              <div id="evaluation-table-${batchName}"></div>
          </div>
      `;

      mainContainer.appendChild(batchContainer);

      const evaluationTable1 = document.getElementById(
        `evaluation-table-${batchName}`
      );
      const table1 = await createEvaluationTable(
        filteredData,
        `evaluation-table-${batchName}`
      );
      if (table1 && table1.querySelectorAll("th").length > 3) {
        evaluationTable1.appendChild(table1);
        mainContainer.appendChild(batchContainer);
      } else {
        console.log(`No evaluation data for ${batchName}, skipping render.`);
        document.getElementById(
          `trainee-evaluation-custom-template-${batchName}`
        ).style.display = "none";
      }

      // await getAttendanceData(filteredData, `attendanceChart-${batchName}`);
      await generateChartToggle(
        filteredData,
        `attendanceChart-${batchName}`,
        "bar"
      );
      document
        .getElementById("chartTypeDropdownAttendance")
        .addEventListener("change", (event) => {
          const selectedChartType = event.target.value;
          generateChartToggle(
            filteredData,
            `attendanceChart-${batchName}`,
            selectedChartType
          );
        });
    }
  }

  async function batchwiseDataCustomTemplate(selectedBatch) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const mainContainer = document.getElementById(
      "batchwise-data-custom-template"
    );
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `<div class="batch-info-custom">
   <p id="batch-sessions-month-custom-template"></p>
                          <h1 id="batch-name-custom-template"></h1>
                         
                                  <p id="batch-duration-month-custom-template"></p>
                      </div>
              
                     
                         
                       
                            
                              <div class="attendance-custom-template">
                                  <h3>Attendance</h3>
                                  <canvas id="attendanceChart-custom" width="250" height="70"></canvas>
                              </div>
                          
                      
          <div class="trainee-evaluation-custom-template" id="trainee-evaluation-custom-template">
            <h3>Evaluation Details</h3>
            <div id="evaluation-table-custom-template"></div>

          </div>`;

    const currentDate = await getLatestCollection();
    const filteredData = await getFilteredDocuments(selectedBatch);

    const template1Header = document.getElementById("custom-template-month");
    template1Header.textContent = formatCollectionName(currentDate);

    const sessionsPerBatch = batchDetails[selectedBatch].numberOfSessionsMonth;
    const sessionsTemplate1 = document.getElementById(
      "batch-sessions-month-custom-template"
    );
    sessionsTemplate1.textContent = `Total Sessions: ${sessionsPerBatch}`;

    const durationPerBatch = batchDetails[selectedBatch].batchDurationMonth;
    const durationTemplate1 = document.getElementById(
      "batch-duration-month-custom-template"
    );
    durationTemplate1.textContent = `Total duration: ${durationPerBatch}`;

    const evaluationTable1 = document.getElementById(
      "evaluation-table-custom-template"
    );
    const table1 = await createEvaluationTable(
      filteredData,
      "evaluation-table-custom-template"
    );
    if (table1 && table1.querySelectorAll("th").length > 3) {
      evaluationTable1.appendChild(table1);
      mainContainer.appendChild(batchContainer);
    } else {
      console.log(`No evaluation data for, skipping render.`);
      document.getElementById(
        "trainee-evaluation-custom-template"
      ).style.display = "none";
    }

    const template2Header = document.getElementById(
      "batch-name-custom-template"
    );
    template2Header.textContent = selectedBatch;

    generateChartToggle(filteredData, "attendanceChart-custom", "bar");
    document
      .getElementById("chartTypeDropdownAttendance")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateChartToggle(
          filteredData,
          "attendanceChart-custom",
          selectedChartType
        );
      });

    // const traineeDetailsTemplate2 = document.getElementById("trainee-details-template2");
    // const traineeTable2 = await getTraineeDetails(filteredData,"trainee-details-template2");
    // traineeDetailsTemplate2.appendChild(traineeTable2);

    const numberOfTrainees = document.getElementById("learnersChart-custom");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];
    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-custom",
      "line",
      backgroundColor,
      borderColor
    );

    const batchCountDisplay = document.getElementById("number-custom");
    batchCountDisplay.textContent = await getNofBatches();

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    // const backgroundColor2 = 'rgba(153, 102, 255, 0.2)';
    // const borderColor2 = 'rgba(153, 102, 255, 1)';

    initCertificationChart(
      "levelChart-custom",
      backgroundColor,
      borderColor,
      "bar"
    );

    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-custom",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    // loadAndDisplayBatchDetails("sessionsChart","batchDurationChart","durationChart",selectedBatch);
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(
      batchDetailsData,
      "batchDurationChart-custom",
      "pie"
    );
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-custom",
          selectedChartType
        );
      });
    generateSessionChart(batchDetailsData, "sessionsChart-custom", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-custom",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-custom-template");

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-custom",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
  }

  async function populateBatchDataCustomTemplateUser(currentDate) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const mainContainer = document.getElementById("custom-dynamic-table-user");
    mainContainer.innerHTML = "";

    const mainContainer2 = document.getElementById(
      "custom-dynamic-table-user2"
    );
    mainContainer.innerHTML = "";

    const numberOfBatches = Object.keys(batchDetails).length;

    const numberOfTrainees = document.getElementById(
      "learnersChart-custom-user"
    );
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-custom-user",
      "line",
      backgroundColor,
      borderColor
    );

    initCertificationChart(
      "levelChart-custom-user",
      backgroundColor,
      borderColor,
      "bar"
    );

    // loadSessionsAndDurationWholeBatch("sessionsChart","batchDurationChart");
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(
      batchDetailsData,
      "batchDurationChart-custom-user",
      "pie"
    );

    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-custom-user",
          selectedChartType
        );
      });

    generateSessionChart(batchDetailsData, "sessionsChart-custom-user", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-custom-user",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-custom-user-template");

    const batchCountDisplay = document.getElementById("number-custom-user");
    batchCountDisplay.textContent = numberOfBatches;

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-custom-user",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-custom-user",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    const template1Header = document.getElementById("custom-template-month");
    template1Header.textContent = formatCollectionName(currentDate);

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);

      const batchContainer = document.createElement("div");
      batchContainer.classList.add("custom-dynamic-table-user");

      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue; // Skip this iteration
      }

      batchContainer.innerHTML = `
          <div class="batch-info-custom-user">
          <p>Total Sessions: ${numberOfSessionsMonth} </p>
              <h1>${batchName}</h1>
          <p>Total Duration: ${batchDurationMonth} hrs</p>    
          </div>
     
                 
                  <div class="attendance-custom-user-template">
                      <h3>Attendance</h3>
                      <canvas id="attendanceChart-${batchName}" width="250" height="70"></canvas>
                  </div>
         
          <div class="trainee-evaluation-custom-user-template" id="trainee-evaluation-custom-user-template-${batchName}" >
          <h3>Evaluation Details</h3>
              <div id="evaluation-table-${batchName}"></div>
          </div>
      `;

      mainContainer.appendChild(batchContainer);

      const evaluationTable1 = document.getElementById(
        `evaluation-table-${batchName}`
      );
      const table1 = await createEvaluationTable(
        filteredData,
        `evaluation-table-${batchName}`
      );
      if (table1 && table1.querySelectorAll("th").length > 3) {
        evaluationTable1.appendChild(table1);
        mainContainer.appendChild(batchContainer);
      } else {
        console.log(`No evaluation data for ${batchName}, skipping render.`);
        document.getElementById(
          `trainee-evaluation-custom-user-template-${batchName}`
        ).style.display = "none";
      }

      // await getAttendanceData(filteredData, `attendanceChart-${batchName}`);
      await generateChartToggle(
        filteredData,
        `attendanceChart-${batchName}`,
        "bar"
      );
      document
        .getElementById("chartTypeDropdownAttendance")
        .addEventListener("change", (event) => {
          const selectedChartType = event.target.value;
          generateChartToggle(
            filteredData,
            `attendanceChart-${batchName}`,
            selectedChartType
          );
        });
    }

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);
      const batchContainer2 = document.createElement("div");
      batchContainer2.classList.add("custom-dynamic-table-user2");

      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue; // Skip this iteration
      }

      batchContainer2.innerHTML = `
    <div class="batch-info-custom-user">
    <h1>${batchName}</h1>
    <p>Total Sessions: ${numberOfSessionsMonth} </p>
        
    <p>Total Duration: ${batchDurationMonth} hrs</p>    
    </div>
   
    <div class="trainee-evaluation-custom-user-template">
    <h3>Batch Details</h3>
        <div id="evaluation-table2-${batchName}"></div>
    </div>
`;
      mainContainer2.appendChild(batchContainer2);

      const evaluationTable2 = document.getElementById(
        `evaluation-table2-${batchName}`
      );
      const table2 = await createEvaluationTable2(
        filteredData,
        `evaluation-table2-${batchName}`
      );
      evaluationTable2.appendChild(table2);
    }
  }

  async function batchwiseDataCustomTemplateUser(selectedBatch) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const mainContainer = document.getElementById("custom-dynamic-table-user");
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `<div class="batch-info-custom-user">
   <p id="batch-sessions-month-custom-user-template"></p>
                          <h1 id="batch-name-custom-user-template"></h1>
                         
                                  <p id="batch-duration-month-custom-user-template"></p>
                      </div>
              
                     
                         
                       
                            
                              <div class="attendance-custom-user-template">
                                  <h3>Attendance</h3>
                                  <canvas id="attendanceChart-custom-user" width="250" height="70"></canvas>
                              </div>
                          
                      
          <div class="trainee-evaluation-custom-user-template" id="trainee-evaluation-custom-user-template">
            <h3>Evaluation Details</h3>
            <div id="evaluation-table-custom-user-template"></div>

          </div>`;

    const currentDate = await getLatestCollection();
    const filteredData = await getFilteredDocuments(selectedBatch);

    const template1Header = document.getElementById("custom-template-month");
    template1Header.textContent = formatCollectionName(currentDate);

    const sessionsPerBatch = batchDetails[selectedBatch].numberOfSessionsMonth;
    const sessionsTemplate1 = document.getElementById(
      "batch-sessions-month-custom-user-template"
    );
    sessionsTemplate1.textContent = `Total Sessions: ${sessionsPerBatch}`;

    const durationPerBatch = batchDetails[selectedBatch].batchDurationMonth;
    const durationTemplate1 = document.getElementById(
      "batch-duration-month-custom-user-template"
    );
    durationTemplate1.textContent = `Total duration: ${durationPerBatch}`;

    const evaluationTable1 = document.getElementById(
      "evaluation-table-custom-user-template"
    );
    const table1 = await createEvaluationTable(
      filteredData,
      "evaluation-table-custom-user-template"
    );
    if (table1 && table1.querySelectorAll("th").length > 3) {
      evaluationTable1.appendChild(table1);
      mainContainer.appendChild(batchContainer);
    } else {
      console.log(`No evaluation data for, skipping render.`);
      document.getElementById(
        "trainee-evaluation-custom-user-template"
      ).style.display = "none";
    }

    const template2Header = document.getElementById(
      "batch-name-custom-user-template"
    );
    template2Header.textContent = selectedBatch;

    generateChartToggle(filteredData, "attendanceChart-custom-user", "bar");
    document
      .getElementById("chartTypeDropdownAttendance")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateChartToggle(
          filteredData,
          "attendanceChart-custom-user",
          selectedChartType
        );
      });

    // const traineeDetailsTemplate2 = document.getElementById("trainee-details-template2");
    // const traineeTable2 = await getTraineeDetails(filteredData,"trainee-details-template2");
    // traineeDetailsTemplate2.appendChild(traineeTable2);

    const numberOfTrainees = document.getElementById(
      "learnersChart-custom-user"
    );
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];
    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-custom-user",
      "line",
      backgroundColor,
      borderColor
    );

    const batchCountDisplay = document.getElementById("number-custom-user");
    batchCountDisplay.textContent = await getNofBatches();

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    // const backgroundColor2 = 'rgba(153, 102, 255, 0.2)';
    // const borderColor2 = 'rgba(153, 102, 255, 1)';

    initCertificationChart(
      "levelChart-custom-user",
      backgroundColor,
      borderColor,
      "bar"
    );

    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-custom-user",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    // loadAndDisplayBatchDetails("sessionsChart","batchDurationChart","durationChart",selectedBatch);
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(
      batchDetailsData,
      "batchDurationChart-custom-user",
      "pie"
    );
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-custom-user",
          selectedChartType
        );
      });
    generateSessionChart(batchDetailsData, "sessionsChart-custom-user", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-custom-user",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-custom-user-template");

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-custom-user",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
  }



  async function batchwiseDataTemplate1(selectedBatch) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }
    const certificationConatianer = document.getElementById(
      "whole-batch-cutoff-container"
    );
    certificationConatianer.innerHTML = "";
    certificationConatianer.innerHTML = `<div class="current-level-template1">
                      <div class="level-heading" id="level-heading">
                        <p>Current Learning Level</p>
                      </div>
                      <div class="inner-level-template1">
                        <canvas id="certificationBarChart" width="200" height="200"></canvas>                    
                      </div>
                    </div>
                    <div class="batch-duration-template1">
                      <div class="duration-heading-template1" id="duration-heading-template1">
                        <p>Total Batch Duration</p>
                      </div>
                      <div class="duration-body-template1">
                        <canvas id="whole-duration-data-templae1" width="200" height="190"></canvas>
                      </div>
                    </div>`;
    const mainContainer = document.getElementById("right-template1");
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `<h1 id="batch-text-template1"></h1>
                    <div class="duration-sessions-template1">
                      <div class="duration-sessions-heading-template1" id="duration-sessions-heading-template1">
                        <p>Batch Duration</p>
                      </div>
                      <div class="duration-sessions-body-template1">
                        <div id="duration-sessions-data-template1" >
                        <h2 id="total-duration-month-template1"></h2>
                        <h2 id="total-session-month-template1"></h2>
                        </div>
                      </div>
                    </div>                   
                    <div class="attendance-template1">
                      <div class="attendance-heading-template1" id="attendance-heading-template1">
                        <p>Average Attendance</p>
                      </div>
                      <div class="attendance-body-template1">
                        <canvas id="attendance-body-template1" hight="350" width="200"></canvas>
                      </div>
                    </div>
                    <div class="evaluation-template1">
                      <div class="evaluation-heading-template1" id="evaluation-heading-template1">
                        <p>Evaluation Details</p>
                      </div>
                      <div class="evaluation-body-template1">
                        <div id="trainee-details-template1"></div>
                      </div>
                    </div>`;
    const bottomContainer = document.getElementById("bottum-cutoff-template1");
    bottomContainer.innerHTML = "";
    bottomContainer.innerHTML = `<div class="batch-evaluation-template1" id="batch-evaluation-template1">
                  <div class="batch-evaluation-heading-template1" id="batch-evaluation-heading-template1">
                    <p>Evaluation Details</p>
                  </div>
                  <div class="batch-evaluation-body-template1">
                    <div id="evaluation-table-template1"></div>
                  </div>
                </div>`;

    const currentDate = await getLatestCollection();
    const filteredData = await getFilteredDocuments(selectedBatch);

    const template2Header = document.getElementById("batch-text-template1");
    template2Header.textContent = selectedBatch;
    const template1Header = document.getElementById("header-template1-h3");
    template1Header.textContent = formatCollectionName(currentDate);
    generateChartToggle(filteredData, "attendance-body-template1", "bar");
    document
      .getElementById("chartTypeDropdownAttendance")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateChartToggle(
          filteredData,
          "attendance-body-template1",
          selectedChartType
        );
      });
    // generateChartToggle(filteredData, 'attendance-body-template1', 'bar');

    const traineeDetailsTemplate1 = document.getElementById(
      "trainee-details-template1"
    );

    const traineeTable1 = await getTraineeDetails(
      filteredData,
      "trainee-details-template1"
    );
    traineeDetailsTemplate1.appendChild(traineeTable1);

    const evaluationTable1 = document.getElementById(
      "evaluation-table-template1"
    );
    const table1 = await createEvaluationTable(
      filteredData,
      "evaluation-table-template1"
    );
    evaluationTable1.appendChild(table1);

    const numberOfTrainees = document.getElementById(
      "trainee-piechart-template1"
    );

    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(128, 97, 195, 1)",
      "rgba(146, 113, 209, 1)",
      "rgba(164, 130, 223, 1)",
      "rgba(182, 146, 237, 1)",
      "rgba(200, 163, 251, 1)",
      "rgba(218, 180, 255, 1)",
    ];
    numberOfTrainees.textContent = generateTraineePieChart(
      "trainee-piechart-template1",
      "line",
      backgroundColor,
      borderColor
    );

    // initCertificationChart("certificationBarChart",backgroundColor,borderColor,'bar');

    // document.getElementById('chartType-dropdown-certification').addEventListener('change', (event) => {
    //     const selectedChartType = event.target.value;
    //     initCertificationChart("certificationBarChart",backgroundColor,borderColor,selectedChartType);

    //   });

    initTrainerDetails("trainer-name-template1");

    // loadAndDisplayBatchDetails(
    //   "progressBarsContainer-templae1",
    //   "whole-duration-data-templae1",
    //   "duration-sessions-data-template1",
    //   selectedBatch
    // );

    const sessionsPerBatch = batchDetails[selectedBatch].numberOfSessionsMonth;
    const sessionsTemplate1 = document.getElementById(
      "total-session-month-template1"
    );
    sessionsTemplate1.textContent = `Total Sessions: ${sessionsPerBatch}`;

    const durationPerBatch = batchDetails[selectedBatch].batchDurationMonth;
    const durationTemplate1 = document.getElementById(
      "total-duration-month-template1"
    );
    durationTemplate1.textContent = `Total duration: ${durationPerBatch}`;

    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(
      batchDetailsData,
      "whole-duration-data-templae1",
      "pie"
    );
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "whole-duration-data-templae1",
          selectedChartType
        );
      });
    generateSessionChart(
      batchDetailsData,
      "progressBarsContainer-templae1",
      "pie"
    );
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "progressBarsContainer-templae1",
          selectedChartType
        );
      });

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "trainee-piechart-template1",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    initCertificationChart(
      "certificationBarChart",
      backgroundColor,
      borderColor,
      "bar"
    );

    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "certificationBarChart",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });

    initTrainerDetails("trainer-name-template1");

    // loadAndDisplayBatchDetails(
    //   "progressBarsContainer-templae1",
    //   "whole-duration-data-templae1",
    //   "duration-sessions-data-template1",
    //   selectedBatch
    // );

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "trainee-piechart-template1",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
  }

  async function batchwiseDataTemplate2(selectedBatch) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const mainContainer = document.getElementById("batchwise-data-template2");
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `<div class="batch-info">
     <p id="batch-sessions-month-template2"></p>
                            <h1 id="batch-name-template2"></h1>
                           
                                    <p id="batch-duration-month-template2"></p>
                        </div>
                
                       
                           
                         
                              
                                <div class="attendance-template2">
                                    <h3>Attendance</h3>
                                    <canvas id="attendanceChart" width="250" height="70"></canvas>
                                </div>
                            
                        
						<div class="trainee-evaluation-template2" id="trainee-evaluation-template2">
							<h3>Evaluation Details</h3>
							<div id="evaluation-table-template2"></div>

						</div>`;

    const currentDate = await getLatestCollection();
    const filteredData = await getFilteredDocuments(selectedBatch);

    const template1Header = document.getElementById("template2-month");
    template1Header.textContent = formatCollectionName(currentDate);

    const sessionsPerBatch = batchDetails[selectedBatch].numberOfSessionsMonth;
    const sessionsTemplate1 = document.getElementById(
      "batch-sessions-month-template2"
    );
    sessionsTemplate1.textContent = `Total Sessions: ${sessionsPerBatch}`;

    const durationPerBatch = batchDetails[selectedBatch].batchDurationMonth;
    const durationTemplate1 = document.getElementById(
      "batch-duration-month-template2"
    );
    durationTemplate1.textContent = `Total duration: ${durationPerBatch}`;

    const evaluationTable1 = document.getElementById(
      "evaluation-table-template2"
    );
    const table1 = await createEvaluationTable(
      filteredData,
      "evaluation-table-template2"
    );
    if (table1 && table1.querySelectorAll("th").length > 3) {
      evaluationTable1.appendChild(table1);
      mainContainer.appendChild(evaluationTable1);
    } else {
      console.log(`No evaluation data for, skipping render.`);
      document.getElementById("trainee-evaluation-template2").style.display =
        "none";
    }

    const template2Header = document.getElementById("batch-name-template2");
    template2Header.textContent = selectedBatch;

    generateChartToggle(filteredData, "attendanceChart", "bar");
    document
      .getElementById("chartTypeDropdownAttendance")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateChartToggle(filteredData, "attendanceChart", selectedChartType);
      });

    // const traineeDetailsTemplate2 = document.getElementById("trainee-details-template2");
    // const traineeTable2 = await getTraineeDetails(filteredData,"trainee-details-template2");
    // traineeDetailsTemplate2.appendChild(traineeTable2);

    const numberOfTrainees = document.getElementById("learnersChart");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];
    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart",
      "line",
      backgroundColor,
      borderColor
    );

    const batchCountDisplay = document.getElementById("number");
    batchCountDisplay.textContent = await getNofBatches();

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    // const backgroundColor2 = 'rgba(153, 102, 255, 0.2)';
    // const borderColor2 = 'rgba(153, 102, 255, 1)';

    initCertificationChart("levelChart", backgroundColor, borderColor, "bar");

    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    // loadAndDisplayBatchDetails("sessionsChart","batchDurationChart","durationChart",selectedBatch);
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart", "pie");
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart",
          selectedChartType
        );
      });
    generateSessionChart(batchDetailsData, "sessionsChart", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template2");

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
  }

  async function batchwiseDataTemplate10(selectedBatch) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const mainContainer = document.getElementById("batchwise-data-template-10");
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `<div class="batch-info-10">
     <p id="batch-sessions-month-template-10"></p>
                            <h1 id="batch-name-template-10"></h1>
                           
                                    <p id="batch-duration-month-template-10"></p>
                        </div>
                
                       
                           
                         
                              
                                <div class="attendance-template-10">
                                    <h3>Attendance</h3>
                                    <canvas id="attendanceChart-10" width="250" height="70"></canvas>
                                </div>
                            
                        
						<div class="trainee-evaluation-template-10" id="trainee-evaluation-template-10">
							<h3>Evaluation Details</h3>
							<div id="evaluation-table-template-10"></div>

						</div>`;

    const currentDate = await getLatestCollection();
    const filteredData = await getFilteredDocuments(selectedBatch);

    const template1Header = document.getElementById("template-10-month");
    template1Header.textContent = formatCollectionName(currentDate);

    const sessionsPerBatch = batchDetails[selectedBatch].numberOfSessionsMonth;
    const sessionsTemplate1 = document.getElementById(
      "batch-sessions-month-template-10"
    );
    sessionsTemplate1.textContent = `Total Sessions: ${sessionsPerBatch}`;

    const durationPerBatch = batchDetails[selectedBatch].batchDurationMonth;
    const durationTemplate1 = document.getElementById(
      "batch-duration-month-template-10"
    );
    durationTemplate1.textContent = `Total duration: ${durationPerBatch}`;

    const evaluationTable1 = document.getElementById(
      "evaluation-table-template-10"
    );
    const table1 = await createEvaluationTable(
      filteredData,
      "evaluation-table-template-10"
    );
    if (table1 && table1.querySelectorAll("th").length > 3) {
      evaluationTable1.appendChild(table1);
      mainContainer.appendChild(evaluationTable1);
    } else {
      console.log(`No evaluation data for, skipping render.`);
      document.getElementById("trainee-evaluation-template-10").style.display =
        "none";
    }

    const template2Header = document.getElementById("batch-name-template-10");
    template2Header.textContent = selectedBatch;

    generateChartToggle(filteredData, "attendanceChart-10", "bar");
    document
      .getElementById("chartTypeDropdownAttendance")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateChartToggle(filteredData, "attendanceChart-10", selectedChartType);
      });

    // const traineeDetailsTemplate2 = document.getElementById("trainee-details-template2");
    // const traineeTable2 = await getTraineeDetails(filteredData,"trainee-details-template2");
    // traineeDetailsTemplate2.appendChild(traineeTable2);

    const numberOfTrainees = document.getElementById("learnersChart-10");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];
    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-10",
      "line",
      backgroundColor,
      borderColor
    );

    const batchCountDisplay = document.getElementById("number-10");
    batchCountDisplay.textContent = await getNofBatches();

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    // const backgroundColor2 = 'rgba(153, 102, 255, 0.2)';
    // const borderColor2 = 'rgba(153, 102, 255, 1)';

    initCertificationChart("levelChart-10", backgroundColor, borderColor, "bar");

    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-10",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    // loadAndDisplayBatchDetails("sessionsChart","batchDurationChart","durationChart",selectedBatch);
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart-10", "pie");
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-10",
          selectedChartType
        );
      });
    generateSessionChart(batchDetailsData, "sessionsChart-10", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-10",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template-10");

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-10",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
  }

  async function batchwiseDataTemplate11(selectedBatch) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const mainContainer = document.getElementById("batchwise-data-template-11");
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `<div class="batch-info-11">
     <p id="batch-sessions-month-template-11"></p>
                            <h1 id="batch-name-template-11"></h1>
                           
                                    <p id="batch-duration-month-template-11"></p>
                        </div>
                
                       
                           
                         
                              
                                <div class="attendance-template-11">
                                    <h3>Attendance</h3>
                                    <canvas id="attendanceChart-11" width="250" height="70"></canvas>
                                </div>
                            
                        
						<div class="trainee-evaluation-template-11" id="trainee-evaluation-template-11">
							<h3>Evaluation Details</h3>
							<div id="evaluation-table-template-11"></div>

						</div>`;

    const currentDate = await getLatestCollection();
    const filteredData = await getFilteredDocuments(selectedBatch);

    const template1Header = document.getElementById("template-11-month");
    template1Header.textContent = formatCollectionName(currentDate);

    const sessionsPerBatch = batchDetails[selectedBatch].numberOfSessionsMonth;
    const sessionsTemplate1 = document.getElementById(
      "batch-sessions-month-template-11"
    );
    sessionsTemplate1.textContent = `Total Sessions: ${sessionsPerBatch}`;

    const durationPerBatch = batchDetails[selectedBatch].batchDurationMonth;
    const durationTemplate1 = document.getElementById(
      "batch-duration-month-template-11"
    );
    durationTemplate1.textContent = `Total duration: ${durationPerBatch}`;

    const evaluationTable1 = document.getElementById(
      "evaluation-table-template-11"
    );
    const table1 = await createEvaluationTable(
      filteredData,
      "evaluation-table-template-11"
    );
    if (table1 && table1.querySelectorAll("th").length > 3) {
      evaluationTable1.appendChild(table1);
      mainContainer.appendChild(evaluationTable1);
    } else {
      console.log(`No evaluation data for, skipping render.`);
      document.getElementById("trainee-evaluation-template-11").style.display =
        "none";
    }

    const template2Header = document.getElementById("batch-name-template-11");
    template2Header.textContent = selectedBatch;

    generateChartToggle(filteredData, "attendanceChart-11", "bar");
    document
      .getElementById("chartTypeDropdownAttendance")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateChartToggle(filteredData, "attendanceChart-11", selectedChartType);
      });

    // const traineeDetailsTemplate2 = document.getElementById("trainee-details-template2");
    // const traineeTable2 = await getTraineeDetails(filteredData,"trainee-details-template2");
    // traineeDetailsTemplate2.appendChild(traineeTable2);

    const numberOfTrainees = document.getElementById("learnersChart-11");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];
    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-11",
      "line",
      backgroundColor,
      borderColor
    );

    const batchCountDisplay = document.getElementById("number-11");
    batchCountDisplay.textContent = await getNofBatches();

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    // const backgroundColor2 = 'rgba(153, 102, 255, 0.2)';
    // const borderColor2 = 'rgba(153, 102, 255, 1)';

    initCertificationChart("levelChart-11", backgroundColor, borderColor, "bar");

    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-11",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    // loadAndDisplayBatchDetails("sessionsChart","batchDurationChart","durationChart",selectedBatch);
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart-11", "pie");
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-11",
          selectedChartType
        );
      });
    generateSessionChart(batchDetailsData, "sessionsChart-11", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-11",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template-11");

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-11",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
  }

  async function batchwiseDataTemplate12(selectedBatch) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const mainContainer = document.getElementById("batchwise-data-template-12");
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `<div class="batch-info-12">
     <p id="batch-sessions-month-template-12"></p>
                            <h1 id="batch-name-template-12"></h1>
                           
                                    <p id="batch-duration-month-template-12"></p>
                        </div>
                
                       
                           
                         
                              
                                <div class="attendance-template-12">
                                    <h3>Attendance</h3>
                                    <canvas id="attendanceChart-12" width="250" height="70"></canvas>
                                </div>
                            
                        
						<div class="trainee-evaluation-template-12" id="trainee-evaluation-template-12">
							<h3>Evaluation Details</h3>
							<div id="evaluation-table-template-12"></div>

						</div>`;

    const currentDate = await getLatestCollection();
    const filteredData = await getFilteredDocuments(selectedBatch);

    const template1Header = document.getElementById("template-12-month");
    template1Header.textContent = formatCollectionName(currentDate);

    const sessionsPerBatch = batchDetails[selectedBatch].numberOfSessionsMonth;
    const sessionsTemplate1 = document.getElementById(
      "batch-sessions-month-template-12"
    );
    sessionsTemplate1.textContent = `Total Sessions: ${sessionsPerBatch}`;

    const durationPerBatch = batchDetails[selectedBatch].batchDurationMonth;
    const durationTemplate1 = document.getElementById(
      "batch-duration-month-template-12"
    );
    durationTemplate1.textContent = `Total duration: ${durationPerBatch}`;

    const evaluationTable1 = document.getElementById(
      "evaluation-table-template-12"
    );
    const table1 = await createEvaluationTable(
      filteredData,
      "evaluation-table-template-12"
    );
    if (table1 && table1.querySelectorAll("th").length > 3) {
      evaluationTable1.appendChild(table1);
      mainContainer.appendChild(evaluationTable1);
    } else {
      console.log(`No evaluation data for, skipping render.`);
      document.getElementById("trainee-evaluation-template-12").style.display =
        "none";
    }

    const template2Header = document.getElementById("batch-name-template-12");
    template2Header.textContent = selectedBatch;

    generateChartToggle(filteredData, "attendanceChart-12", "bar");
    document
      .getElementById("chartTypeDropdownAttendance")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateChartToggle(filteredData, "attendanceChart-12", selectedChartType);
      });

    // const traineeDetailsTemplate2 = document.getElementById("trainee-details-template2");
    // const traineeTable2 = await getTraineeDetails(filteredData,"trainee-details-template2");
    // traineeDetailsTemplate2.appendChild(traineeTable2);

    const numberOfTrainees = document.getElementById("learnersChart-12");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];
    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-12",
      "line",
      backgroundColor,
      borderColor
    );

    const batchCountDisplay = document.getElementById("number-12");
    batchCountDisplay.textContent = await getNofBatches();

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    // const backgroundColor2 = 'rgba(153, 102, 255, 0.2)';
    // const borderColor2 = 'rgba(153, 102, 255, 1)';

    initCertificationChart("levelChart-12", backgroundColor, borderColor, "bar");

    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-12",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    // loadAndDisplayBatchDetails("sessionsChart","batchDurationChart","durationChart",selectedBatch);
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart-12", "pie");
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-12",
          selectedChartType
        );
      });
    generateSessionChart(batchDetailsData, "sessionsChart-12", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-12",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template-12");

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-12",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
  }

  async function batchwiseDataTemplate13(selectedBatch) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const mainContainer = document.getElementById("batchwise-data-template-13");
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `<div class="batch-info-13">
     <p id="batch-sessions-month-template-13"></p>
                            <h1 id="batch-name-template-13"></h1>
                           
                                    <p id="batch-duration-month-template-13"></p>
                        </div>
                
                       
                           
                         
                              
                                <div class="attendance-template-13">
                                    <h3>Attendance</h3>
                                    <canvas id="attendanceChart-13" width="250" height="70"></canvas>
                                </div>
                            
                        
						<div class="trainee-evaluation-template-13" id="trainee-evaluation-template-13">
							<h3>Evaluation Details</h3>
							<div id="evaluation-table-template-13"></div>

						</div>`;

    const currentDate = await getLatestCollection();
    const filteredData = await getFilteredDocuments(selectedBatch);

    const template1Header = document.getElementById("template-13-month");
    template1Header.textContent = formatCollectionName(currentDate);

    const sessionsPerBatch = batchDetails[selectedBatch].numberOfSessionsMonth;
    const sessionsTemplate1 = document.getElementById(
      "batch-sessions-month-template-13"
    );
    sessionsTemplate1.textContent = `Total Sessions: ${sessionsPerBatch}`;

    const durationPerBatch = batchDetails[selectedBatch].batchDurationMonth;
    const durationTemplate1 = document.getElementById(
      "batch-duration-month-template-13"
    );
    durationTemplate1.textContent = `Total duration: ${durationPerBatch}`;

    const evaluationTable1 = document.getElementById(
      "evaluation-table-template-13"
    );
    const table1 = await createEvaluationTable(
      filteredData,
      "evaluation-table-template-13"
    );
    if (table1 && table1.querySelectorAll("th").length > 3) {
      evaluationTable1.appendChild(table1);
      mainContainer.appendChild(evaluationTable1);
    } else {
      console.log(`No evaluation data for, skipping render.`);
      document.getElementById("trainee-evaluation-template-13").style.display =
        "none";
    }

    const template2Header = document.getElementById("batch-name-template-13");
    template2Header.textContent = selectedBatch;

    generateChartToggle(filteredData, "attendanceChart-13", "bar");
    document
      .getElementById("chartTypeDropdownAttendance")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateChartToggle(filteredData, "attendanceChart-13", selectedChartType);
      });

    // const traineeDetailsTemplate2 = document.getElementById("trainee-details-template2");
    // const traineeTable2 = await getTraineeDetails(filteredData,"trainee-details-template2");
    // traineeDetailsTemplate2.appendChild(traineeTable2);

    const numberOfTrainees = document.getElementById("learnersChart-13");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];
    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-13",
      "line",
      backgroundColor,
      borderColor
    );

    const batchCountDisplay = document.getElementById("number-13");
    batchCountDisplay.textContent = await getNofBatches();

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    // const backgroundColor2 = 'rgba(153, 102, 255, 0.2)';
    // const borderColor2 = 'rgba(153, 102, 255, 1)';

    initCertificationChart("levelChart-13", backgroundColor, borderColor, "bar");

    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-13",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    // loadAndDisplayBatchDetails("sessionsChart","batchDurationChart","durationChart",selectedBatch);
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart-13", "pie");
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-13",
          selectedChartType
        );
      });
    generateSessionChart(batchDetailsData, "sessionsChart-13", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-13",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template-13");

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-13",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
  }


  async function batchwiseDataTemplate14(selectedBatch) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const mainContainer = document.getElementById("batchwise-data-template-14");
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `<div class="batch-info-14">
     <p id="batch-sessions-month-template-14"></p>
                            <h1 id="batch-name-template-14"></h1>
                           
                                    <p id="batch-duration-month-template-14"></p>
                        </div>
                
                       
                           
                         
                              
                                <div class="attendance-template-14">
                                    <h3>Attendance</h3>
                                    <canvas id="attendanceChart-14" width="250" height="70"></canvas>
                                </div>
                            
                        
						<div class="trainee-evaluation-template-14" id="trainee-evaluation-template-14">
							<h3>Evaluation Details</h3>
							<div id="evaluation-table-template-14"></div>

						</div>`;

    const currentDate = await getLatestCollection();
    const filteredData = await getFilteredDocuments(selectedBatch);

    const template1Header = document.getElementById("template-14-month");
    template1Header.textContent = formatCollectionName(currentDate);

    const sessionsPerBatch = batchDetails[selectedBatch].numberOfSessionsMonth;
    const sessionsTemplate1 = document.getElementById(
      "batch-sessions-month-template-14"
    );
    sessionsTemplate1.textContent = `Total Sessions: ${sessionsPerBatch}`;

    const durationPerBatch = batchDetails[selectedBatch].batchDurationMonth;
    const durationTemplate1 = document.getElementById(
      "batch-duration-month-template-14"
    );
    durationTemplate1.textContent = `Total duration: ${durationPerBatch}`;

    const evaluationTable1 = document.getElementById(
      "evaluation-table-template-14"
    );
    const table1 = await createEvaluationTable(
      filteredData,
      "evaluation-table-template-14"
    );
    if (table1 && table1.querySelectorAll("th").length > 3) {
      evaluationTable1.appendChild(table1);
      mainContainer.appendChild(evaluationTable1);
    } else {
      console.log(`No evaluation data for, skipping render.`);
      document.getElementById("trainee-evaluation-template-14").style.display =
        "none";
    }

    const template2Header = document.getElementById("batch-name-template-14");
    template2Header.textContent = selectedBatch;

    generateChartToggle(filteredData, "attendanceChart-14", "bar");
    document
      .getElementById("chartTypeDropdownAttendance")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateChartToggle(filteredData, "attendanceChart-14", selectedChartType);
      });

    // const traineeDetailsTemplate2 = document.getElementById("trainee-details-template2");
    // const traineeTable2 = await getTraineeDetails(filteredData,"trainee-details-template2");
    // traineeDetailsTemplate2.appendChild(traineeTable2);

    const numberOfTrainees = document.getElementById("learnersChart-14");
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];
    numberOfTrainees.textContent = generateTraineePieChart(
      "learnersChart-14",
      "line",
      backgroundColor,
      borderColor
    );

    const batchCountDisplay = document.getElementById("number-14");
    batchCountDisplay.textContent = await getNofBatches();

    // const diaplayBatch = document.getElementById("batch-number");
    // diaplayBatch.textContent = generateTraineeDoughnutChart("batch-number","doughnut",backgroundColor,borderColor);

    // const backgroundColor2 = 'rgba(153, 102, 255, 0.2)';
    // const borderColor2 = 'rgba(153, 102, 255, 1)';

    initCertificationChart("levelChart-14", backgroundColor, borderColor, "bar");

    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-14",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    // loadAndDisplayBatchDetails("sessionsChart","batchDurationChart","durationChart",selectedBatch);
    const batchDetailsData = await getBatchDetailsFromLatestCollection();

    generateSessionDurationChart(batchDetailsData, "batchDurationChart-14", "pie");
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batchDurationChart-14",
          selectedChartType
        );
      });
    generateSessionChart(batchDetailsData, "sessionsChart-14", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-14",
          selectedChartType
        );
      });
    initTrainerDetails("trainer-name-template-14");

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learnersChart-14",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
  }


  async function batchwiseDataTemplate3(selectedBatch) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }
    const mainContainer = document.getElementById("batchwise-data-template3");
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `<div class="t3batchname">
            <div class="t3sessions">
              <h2 class="t3sessions-firsth" id="t3sessions-firsth">Total Sessions:</h2>
			  <h1 class="batch-title" id="batch-title"></h1>
              <h2 class="t3sessions-secondh" id="t3sessions-secondh">Total Duration:</h2>
            </div>
          </div>
          		
            <div class="traneediv">
				<div class="trainee-attendance-template3">
             
       			<div class="t3traineeatt">
					<div class="graph-title-attendance">Trainee Attendence</div>
       				<canvas id="t3graph-attendance" width="300" height="100"> </canvas>
             	</div>
			</div>
           </div>

           <div class="eval-table" id="eval-table">
           		<div class="table-title">Trainee Evaluation</div>
           		<div class="table-section" id="table-section"></div>
            </div>`;
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];
    const sessionsPerBatch = batchDetails[selectedBatch].numberOfSessionsMonth;
    const sessionsTemplate3 = document.getElementById("t3sessions-firsth");
    sessionsTemplate3.textContent = `Total Sessions: ${sessionsPerBatch}`;

    const durationPerBatch = batchDetails[selectedBatch].batchDurationMonth;
    const durationTemplae3 = document.getElementById("t3sessions-secondh");
    durationTemplae3.textContent = `Total duration: ${durationPerBatch}`;

    const currentDate = await getLatestCollection();
    const filteredData = await getFilteredDocuments(selectedBatch);

    const template1Header = document.getElementById("subtitle");
    template1Header.textContent = formatCollectionName(currentDate);

    // const traineeDetailsTemplate1 = document.getElementById("t3graph-trainee");
    // const traineeTable1 = await getTraineeDetails(
    //   filteredData,
    //   "t3graph-trainee"
    // );
    // traineeDetailsTemplate1.appendChild(traineeTable1);

    const evaluationTable1 = document.getElementById("table-section");
    const table1 = await createEvaluationTable(filteredData, "table-section");
    if (table1 && table1.querySelectorAll("th").length > 3) {
      evaluationTable1.appendChild(table1);
      mainContainer.appendChild(evaluationTable1);
    } else {
      console.log(`No evaluation data for, skipping render.`);
      document.getElementById("eval-table").style.display = "none";
    }

    const batchCountDisplay = document.getElementById(
      "number-of-Batch-tmeplate3"
    );
    batchCountDisplay.textContent = await getNofBatches();

    initTrainerDetails("trainers-template3");

    const numberOfTrainees = document.getElementById("card-content");

    numberOfTrainees.textContent = generateTraineePieChart(
      "card-content",
      "line",
      backgroundColor,
      borderColor
    );

    const batchDetailsData = await getBatchDetailsFromLatestCollection();
    generateSessionDurationChart(
      batchDetailsData,
      "card-content-duration",
      "pie"
    );
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "card-content-duration",
          selectedChartType
        );
      });
    generateSessionChart(batchDetailsData, "card-content-sessions", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "card-content-sessions",
          selectedChartType
        );
      });

    const template3Header = document.getElementById("batch-title");
    template3Header.textContent = selectedBatch;
    console.log(selectedBatch);

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "card-content",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });

    generateChartToggle(filteredData, "t3graph-attendance", "bar");
    document
      .getElementById("chartTypeDropdownAttendance")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateChartToggle(
          filteredData,
          "t3graph-attendance",
          selectedChartType
        );
      });

    initCertificationChart(
      "current-level-template3",
      backgroundColor,
      borderColor,
      "bar"
    );

    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "current-level-template3",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
  }

  async function populateBatchDataTemplate5() {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }

    const mainContainer = document.getElementById("batchwise-data-template5");
    mainContainer.innerHTML = "";

    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    initTrainerDetails("trainer-name-template5");

    initCertificationChart("levelChart-t5", backgroundColor, borderColor);

    const numberOfTrainees = document.getElementById(
      "learners-chart-template5"
    );

    numberOfTrainees.textContent = generateTraineePieChart(
      "learners-chart-template5",
      "line",
      backgroundColor,
      borderColor
    );
    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learners-chart-template5",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-t5",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    const batchDetailsData = await getBatchDetailsFromLatestCollection();
    generateSessionDurationChart(
      batchDetailsData,
      "batch-duration-chart-t5",
      "pie"
    );
    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batch-duration-chart-t5",
          selectedChartType
        );
      });
    generateSessionChart(batchDetailsData, "sessionsChart-t5", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-t5",
          selectedChartType
        );
      });

    for (const [batchName, details] of Object.entries(batchDetails)) {
      const filteredData = await getFilteredDocuments(batchName);
      const currentDate = await getLatestCollection();

      const batchContainer = document.createElement("div");
      batchContainer.classList.add("batchwise-data-template5");

      const batchDurationMonth = details.batchDurationMonth;
      const numberOfSessionsMonth = details.numberOfSessionsMonth;

      if (
        batchDurationMonth === undefined ||
        numberOfSessionsMonth === undefined
      ) {
        console.error(`No batch data available for ${batchName}.`);
        continue; // Skip this iteration
      }
      batchContainer.innerHTML = `
            <div class="batch-info-template5">
             <h2>Total Sessions: ${numberOfSessionsMonth}</h2>
                  <h1 id="batch-name-t5-${batchName}">${batchName}</h1>
                  <h2>Total Duration: ${batchDurationMonth} hrs</h2>
                </div>
      
                <div class="details-template5">
               
                  <div class="details-right-template5">
                   
                    <div class="attendance-template5">
                      <h2>Attendance</h2>
                      <canvas id="attendanceChart-t5-${batchName}" width="300" height="100"></canvas>
                    </div>
                  </div>
                </div>
                <div class="trainee-evaluation-template5" id="trainee-evaluation-template5-${batchName}">
                  <h2>Evaluation Details</h2>
                  <div id="evaluation-table-template5-${batchName}"></div>
                </div>
              </div>
        `;

      mainContainer.appendChild(batchContainer);

      const template1Header = document.getElementById("template5-month");
      template1Header.textContent = formatCollectionName(currentDate);

      // await getAttendanceData(filteredData, "attendanceChart-t5");
      await generateChartToggle(
        filteredData,
        `attendanceChart-t5-${batchName}`,
        "bar"
      );

      // const traineeDetailsTemplate1 = document.getElementById(`trainee-details-template5-${batchName}`);
      // const traineeTable1 = await getTraineeDetails(
      //   filteredData,
      //   `trainee-details-template5-${batchName}`
      // );
      // traineeDetailsTemplate1.appendChild(traineeTable1);

      const evaluationTable1 = document.getElementById(
        `evaluation-table-template5-${batchName}`
      );
      const table1 = await createEvaluationTable(
        filteredData,
        `evaluation-table-template5-${batchName}`
      );
      if (table1 && table1.querySelectorAll("th").length > 3) {
        evaluationTable1.appendChild(table1);
        mainContainer.appendChild(batchContainer);
      } else {
        console.log(`No evaluation data for ${batchName}, skipping render.`);
        document.getElementById(
          `trainee-evaluation-template5-${batchName}`
        ).style.display = "none";
      }

      document
        .getElementById("chartTypeDropdownAttendance")
        .addEventListener("change", (event) => {
          const selectedChartType = event.target.value;
          generateChartToggle(
            filteredData,
            `attendanceChart-t5-${batchName}`,
            selectedChartType
          );
        });
    }
  }

  async function batchwiseDataTemplate5(selectedBatch) {
    const batchDetails = await getBatchDetailsFromLatestCollection();
    if (!batchDetails) {
      console.error("No batch details found.");
      return;
    }
    const mainContainer = document.getElementById("batchwise-data-template5");
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `<div class="batch-info">
                <h4 id="batch-duration-template5"></h4>
                  <h1 id="batch-name-t5"></h1>
                  <h4 id="batch-sessions-template5"></h4>
                </div>
      
                
                    
                    <div class="attendance-template5">
                      <h2>Attendance</h2>
                      <canvas id="attendanceChart-t5" width="300" height="100" ></canvas>
                    </div>
             
                <div class="trainee-evaluation-template5" id="trainee-evaluation-template5">
                  <h2>Evaluation Details</h2>
                  <div id="evaluation-table-template5"></div>
                </div>`;
    const backgroundColor = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];
    const borderColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    const sessionsPerBatch = batchDetails[selectedBatch].numberOfSessionsMonth;
    const sessionsTemplate5 = document.getElementById(
      "batch-sessions-template5"
    );
    sessionsTemplate5.textContent = `Total Sessions: ${sessionsPerBatch}`;

    const durationPerBatch = batchDetails[selectedBatch].batchDurationMonth;
    const durationTemplae5 = document.getElementById(
      "batch-duration-template5"
    );
    durationTemplae5.textContent = `Total duration: ${durationPerBatch}`;

    const currentDate = await getLatestCollection();
    const filteredData = await getFilteredDocuments(selectedBatch);

    const batchText = document.getElementById("batch-name-t5");
    batchText.textContent = selectedBatch;

    const template1Header = document.getElementById("template5-month");
    template1Header.textContent = formatCollectionName(currentDate);

    // await getAttendanceData(filteredData, "attendanceChart-t5");
    await generateChartToggle(filteredData, "attendanceChart-t5", "bar");

    // const traineeDetailsTemplate1 = document.getElementById("trainee-details-template5");
    // const traineeTable1 = await getTraineeDetails(
    //   filteredData,
    //   "trainee-details-template5"
    // );
    // traineeDetailsTemplate1.appendChild(traineeTable1);

    const evaluationTable1 = document.getElementById(
      "evaluation-table-template5"
    );
    const table1 = await createEvaluationTable(
      filteredData,
      "evaluation-table-template5"
    );
    if (table1 && table1.querySelectorAll("th").length > 3) {
      evaluationTable1.appendChild(table1);
      mainContainer.appendChild(evaluationTable1);
    } else {
      console.log(`No evaluation data for, skipping render.`);
      document.getElementById("trainee-evaluation-template5").style.display =
        "none";
    }
    initTrainerDetails("trainer-name-template5");

    initCertificationChart("levelChart-t5", backgroundColor, borderColor);

    const numberOfTrainees = document.getElementById(
      "learners-chart-template5"
    );

    numberOfTrainees.textContent = generateTraineePieChart(
      "learners-chart-template5",
      "line",
      backgroundColor,
      borderColor
    );

    const batchDetailsData = await getBatchDetailsFromLatestCollection();
    generateSessionDurationChart(
      batchDetailsData,
      "batch-duration-chart-t5",
      "pie"
    );

    document
      .getElementById("chartType-dropdown-duration-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionDurationChart(
          batchDetailsData,
          "batch-duration-chart-t5",
          selectedChartType
        );
      });
    generateSessionChart(batchDetailsData, "sessionsChart-t5", "pie");
    document
      .getElementById("chartType-dropdown-session-tilldate")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateSessionChart(
          batchDetailsData,
          "sessionsChart-t5",
          selectedChartType
        );
      });

    const template5Header = document.getElementById("batch-title");
    template5Header.textContent = selectedBatch;
    console.log(selectedBatch);

    document
      .getElementById("chartTypeDropdown")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateTraineePieChart(
          "learners-chart-template5",
          selectedChartType,
          backgroundColor,
          borderColor
        );
      });
    document
      .getElementById("chartType-dropdown-certification")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        initCertificationChart(
          "levelChart-t5",
          backgroundColor,
          borderColor,
          selectedChartType
        );
      });
    document
      .getElementById("chartTypeDropdownAttendance")
      .addEventListener("change", (event) => {
        const selectedChartType = event.target.value;
        generateChartToggle(
          filteredData,
          "attendanceChart-t5",
          selectedChartType
        );
      });
  }

  images.forEach((image) => {
    image.addEventListener("click", async function () {
      hideAllTemplates();
      templateKey = this.getAttribute("data-template");
      selectTemplate = templateKey;

      selectedTemplate = document.getElementById(templateKey);
      if (selectedTemplate) {
        const selectedBatch = batchSelect.value;
        if (selectedBatch) {
          const currentDate = await getLatestCollection();
          // const filteredData = await getFilteredDocuments(selectedBatch);
          switch (templateKey) {
            case "template1":
              if (selectedBatch === "whole-batch") {
                const populateBatchTemplate1 =
                  document.getElementById("right-template1");
                populateBatchTemplate1.innerHTML = "";
                const populateBatchTemplate1_ev = document.getElementById(
                  "bottum-cutoff-template1"
                );
                populateBatchTemplate1_ev.innerHTML = "";

                populateBatchDataTemplate1(currentDate);

                // batchSelect.addEventListener("change", async (e) => {
                //   const selectedBatch = e.target.value;
                //   batchwiseDataTemplate1(selectedBatch);
                //   console.log('event listener activate on change:', selectedBatch);

                // });
              } else {
                batchwiseDataTemplate1(selectedBatch);
              }
              break;
            case "template2":
              if (selectedBatch === "whole-batch") {
                const populatedDataTemplate2 = document.getElementById(
                  "batchwise-data-template2"
                );
                populatedDataTemplate2.innerHTML = "";
                populateBatchDataTemplate2(currentDate);
              } else {
                batchwiseDataTemplate2(selectedBatch);
              }
              break;
            case "template3":
              if (selectedBatch === "whole-batch") {
                const populatedDataTemplate3 = document.getElementById(
                  "batchwise-data-template3"
                );
                populatedDataTemplate3.innerHTML = "";
                populateBatchDataTemplate3(currentDate);
              } else {
                batchwiseDataTemplate3(selectedBatch);
              }
              break;
            case "template5":
              if (selectedBatch === "whole-batch") {
                const populatedDataTemplate5 = document.getElementById(
                  "batchwise-data-template5"
                );
                populatedDataTemplate5.innerHTML = "";

                populateBatchDataTemplate5();
              } else {
                batchwiseDataTemplate5(selectedBatch);
              }
              break;

              case "template10":
              if (selectedBatch === "whole-batch") {
                const populatedDataTemplate10 = document.getElementById(
                  "batchwise-data-template-10"
                );
                populatedDataTemplate10.innerHTML = "";
                populateBatchDataTemplate10(currentDate);
              } else {
                batchwiseDataTemplate10(selectedBatch);
              }
              break;
              case "template11":
              if (selectedBatch === "whole-batch") {
                const populatedDataTemplate11 = document.getElementById(
                  "batchwise-data-template-11"
                );
                populatedDataTemplate11.innerHTML = "";
                populateBatchDataTemplate11(currentDate);
              } else {
                batchwiseDataTemplate11(selectedBatch);
              }
              break;
              case "template12":
              if (selectedBatch === "whole-batch") {
                const populatedDataTemplate12 = document.getElementById(
                  "batchwise-data-template-12"
                );
                populatedDataTemplate12.innerHTML = "";
                populateBatchDataTemplate12(currentDate);
              } else {
                batchwiseDataTemplate12(selectedBatch);
              }
              break;
              case "template13":
              if (selectedBatch === "whole-batch") {
                const populatedDataTemplate13 = document.getElementById(
                  "batchwise-data-template-13"
                );
                populatedDataTemplate13.innerHTML = "";
                populateBatchDataTemplate13(currentDate);
              } else {
                batchwiseDataTemplate13(selectedBatch);
              }
              break;
              case "template14":
              if (selectedBatch === "whole-batch") {
                const populatedDataTemplate14 = document.getElementById(
                  "batchwise-data-template-14"
                );
                populatedDataTemplate14.innerHTML = "";
                populateBatchDataTemplate14(currentDate);
              } else {
                batchwiseDataTemplate14(selectedBatch);
              }
              break;

              case "template15":
              if (selectedBatch === "whole-batch") {
                const populatedDataTemplate15 = document.getElementById(
                  "batchwise-data-template-15"
                );
                populatedDataTemplate15.innerHTML = "";
                populateBatchDataTemplate15(currentDate);
              } else {
                batchwiseDataTemplate15(selectedBatch);
              }
              break;
            case "custom-div":
              if (selectedBatch === "whole-batch") {
                const populatedDataTemplate6 = document.getElementById(
                  "batchwise-data-custom-template"
                );
                populatedDataTemplate6.innerHTML = "";
                populateBatchDataCustomTemplate(currentDate);
              } else {
                batchwiseDataCustomTemplate(selectedBatch);
              }
              break;
            case "custom-template-user":
              if (selectedBatch === "whole-batch") {
                const populatedDataTemplate6 = document.getElementById(
                  "custom-dynamic-table-user"
                );
                populatedDataTemplate6.innerHTML = "";
                populateBatchDataCustomTemplateUser(currentDate);
              } else {
                batchwiseDataCustomTemplateUser(selectedBatch);
              }
              break;
          }
        }

        selectedTemplate.style.display = "block";
      }
    });
  });
});

//-------------------- Toggle Charts---------------------------//

///-Change color//

// const selectheme =document.getElementById("theme-color-black");
// selectheme.addEventListener("click",changecolor);
// function testfunction(){
//     alert("hai hisham");
// }

const themeColors = {
  "theme-color-dark-blue": { bg: "#3e68b9", accent: "#6e9af0" },
  "theme-color-violet": { bg: "#8061c3", accent: "#bda7ec" },
  "theme-color-red": { bg: "#dc143c", accent: "#e66a83" },
  "theme-color-blue": { bg: "#64a2f5", accent: "#93bdf5" },
  "theme-color-green": { bg: "#43bf73", accent: "#78d79c" },
  "theme-color-orange": { bg: "#f09951", accent: "#f7b57e" },
};

// Add event listeners to each theme color
document.querySelectorAll(".sidebar-theme div").forEach((div) => {
  div.addEventListener("click", () => {
    applyTheme(div.id);
  });
});
const commonElements = [
  "header-template1",
  "learners-template1",
  "trainer-template1",
  "session-template1",
  "level-heading",
  "duration-heading-template1",
  "duration-sessions-heading-template1",
  "attendance-heading-template1",
  "evaluation-heading-template1",
  "batch-evaluation-heading-template1",
  "container-template2",
  "container-template5",
];

const commonsecondarycolor = [
  // "header-template5"
  // "header-template2"
];

// const commonsecondarycolorclass=[
//   "batch-info",

// ]

const commonclass = [
  "single-batch-sessionDuration-heading-template1",
  "single-batch-info-heading-template1",
  "single-batch-trainee-heading-template1",
  "single-batch-attendance-heading-template1",
  "single-batch-evaluation-heading-template1",
  "t3sessions",
  "card-title",
  "graph-title-trainee",
  "graph-title-attendance",
  "table-title",
];

function applyTheme(themeId) {
  const color = themeColors[themeId] || { bg: "#C3FFC0", accent: "green" };
  console.log("Selected Theme:", themeId);

  // let firstColorDiv = selectedTemplate;
  // firstColorDiv.children[0].children[0].style.backgroundColor = color.bg;
  // firstColorDiv.children[0].children[1].children[0].style.backgroundColor = color.accent;

  // Apply common background color to other elements

  // document.getElementById("left-template1").style.backgroundColor = color.accent;
  document.querySelector(".report-container").style.backgroundColor =
    color.accent;

  commonElements.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.backgroundColor = color.bg;
    }
  });

  commonsecondarycolor.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.backgroundColor = color.accent;
    }
  });

  commonclass.forEach((id) => {
    const elements = document.getElementsByClassName(id);
    // console.log(elements);
    Array.from(elements).forEach((element) => {
      element.style.backgroundColor = color.bg;
    });
  });
  // commonsecondarycolorclass.forEach(id => {
  //   const elements = document.getElementsByClassName(id);
  //   Array.from(elements).forEach(element => {
  //     element.style.backgroundColor = color.accent;
  //   });
  // });

  // Apply colors to tables and progress bars
  const tables = [
    "#trainee-details-template1",
    "#evaluation-table-template1",
    "#trainee-details-template2",
    "#batchwise-data-template2",
    ".t3graphtraine",
    ".table-section",
    ".single-batch-trainee-body-template1",
    ".single-batch-evaluation-body-template1",
  ];

  tables.forEach((tableId) => {
    const thElements = document.querySelectorAll(`${tableId} th`);
    thElements.forEach((e) => (e.style.backgroundColor = color.bg));

    const tdElements = document.querySelectorAll(`${tableId} td`);
    // tdElements.forEach(e => e.style.backgroundColor = color.accent);
    tdElements.forEach((e) => {
      // Get the value inside the cell (can be empty or contain text)
      const cellValue = e.textContent.trim();
      // Only apply color if the value is not 'F' or empty
      if (cellValue !== "F" && cellValue !== "Absent") {
        e.style.backgroundColor = color.accent;
      }
    });
  });

  var th4 = document.querySelectorAll(
    "#whole-duration-data-templae1 .progress-bar"
  );
  th4.forEach((e) => {
    e.style.backgroundColor = color.bg;
  });
  var th1 = document.querySelectorAll(
    "#progressBarsContainer-templae1 .progress-bar"
  );
  th1.forEach((e) => {
    e.style.backgroundColor = color.bg;
  });

  var th2 = document.querySelectorAll(
    "#duration-sessions-data-template1 .progress-bar"
  );
  th2.forEach((e) => {
    e.style.backgroundColor = color.bg;
  });
  var th2 = document.querySelectorAll("#sessionsChart .progress-bar");
  th2.forEach((e) => {
    e.style.backgroundColor = color.bg;
  });
  var th2 = document.querySelectorAll("#batchDurationChart .progress-bar");
  th2.forEach((e) => {
    e.style.backgroundColor = color.bg;
  });
  var th2 = document.querySelectorAll("#durationChart .progress-bar");
  th2.forEach((e) => {
    e.style.backgroundColor = color.bg;
  });
  // var th2 = document.querySelectorAll("#single-batch-info-heading-template1");
  // th2.forEach((e)=>{
  //     e.style.backgroundColor=color.bg;
  // })

  // Change text color for trainer names
  const trainerNamest1 = document.querySelectorAll(
    "#trainer-name-template1 h3"
  );
  trainerNamest1.forEach((e) => (e.style.color = color.bg));
  const NumberofBatchesTwo = document.querySelectorAll("#number");
  NumberofBatchesTwo.forEach((e) => (e.style.color = color.bg));
  const BatchesTextTwo = document.querySelectorAll("#batch-number");
  BatchesTextTwo.forEach((e) => (e.style.color = color.bg));
  const trainerNamest2 = document.querySelectorAll(
    "#trainer-name-template2 h3"
  );
  trainerNamest2.forEach((e) => (e.style.color = color.bg));
  const t1singlebatch = document.querySelectorAll(
    ".single-batch-sessionDuration-body-template1 h2"
  );
  t1singlebatch.forEach((e) => (e.style.color = color.bg));
  const t2batchwiseduration = document.querySelectorAll(
    ".batch-duration-template2 h1"
  );
  t2batchwiseduration.forEach((e) => (e.style.color = color.bg));
  const t3sessions = document.querySelectorAll(".t3sessions h1");
  t3sessions.forEach((e) => (e.style.color = color.bg));
  const t3trainers = document.querySelectorAll("#trainers-template3");
  t3trainers.forEach((e) => (e.style.color = color.bg));
  const t3batchcard = document.querySelectorAll(".batch-card h1");
  t3batchcard.forEach((e) => (e.style.color = color.bg));
  const t3batchcard1 = document.querySelectorAll(
    ".duration-sessions-body-template1 h2"
  );
  t3batchcard1.forEach((e) => (e.style.color = color.bg));

  // const t3batchesh1 = document.querySelectorAll(".t3sessions");
  // t3batchesh1.forEach(e => e.style.color = white);
}

// async function uploadImage()
// {
//   const fileInput = document.getElementById("image-input");
//   let image= fileInput.files[0]
//   console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",image)

//       if (image) {
//           var imageUrl = await uploadImageToFirebase(image);
//           console.log("image link " + imageUrl)

//       }

// }

async function uploadImage() {
  console.log("Starting image upload...");

  const fileInput = document.getElementById("image-input");
  let image = fileInput.files[0];

  if (!image) {
    console.error("No image found in input field!");
    // alert("No image available for upload.");
    showAlert("No image available for upload.");
    return;
  }

  console.log("Uploading image:", image);

  try {
    var imageUrl = await uploadImageToFirebase(image);
    console.log("Image uploaded successfully:", imageUrl);
  } catch (error) {
    console.error("Upload failed:", error);
    // alert("Image upload failed.");
    showAlert("Image upload failed.");
  }
}

document.addEventListener("imageReadyForUpload", function () {
  console.log("Received event: Image is ready for upload. Starting upload...");

  setTimeout(uploadImage, 1500);
});

// firebase-charts.mjs

// async function uploadImage()
// {
//   const fileInput = document.getElementById("img-input");
//   let image= fileInput.files[0]

//       if (image) {
//           var imageUrl = await uploadImageToFirebase(image);
//           console.log("image link " + imageUrl)

//       }

// }

// document.getElementById("save-button").addEventListener("click",uploadImage)

function captureAndDownload() {
  const element = selectedTemplate;
  if (!element) {
    alert("Element not found");
    return;
  }

  const loadingDiv = document.createElement("div");
  loadingDiv.textContent = "Processing HTML...";
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

  // Calculate dimensions for high-quality capture
  const scaleFactor = 4; // High quality
  const width = element.offsetWidth;
  const height = element.offsetHeight;

  html2canvas(element, {
    scale: scaleFactor,
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: width,
    height: height,
    scrollX: 0,
    scrollY: 0,
    backgroundColor: null,
    windowWidth: width,
    windowHeight: height,
    imageTimeout: 0,
    onclone: (doc) => {
      const clonedElement = doc.getElementById(templateKey);
      if (clonedElement) {
        clonedElement.style.width = `${width}px`;
        clonedElement.style.height = `${height}px`;

        // Improve text rendering
        const allText = clonedElement.querySelectorAll(
          "p, span, h1, h2, h3, h4, h5, h6, div"
        );
        allText.forEach((el) => {
          el.style.textRendering = "optimizeLegibility";
          el.style.webkitFontSmoothing = "antialiased";
          el.style.mozOsxFontSmoothing = "grayscale";
        });
      }
    },
  })
    .then((canvas) => {
      // Create final canvas with correct dimensions
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = width * scaleFactor;
      finalCanvas.height = height * scaleFactor;
      const ctx = finalCanvas.getContext("2d");

      // Fill with white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // Draw the captured content
      ctx.drawImage(canvas, 0, 0);

      // Apply sharpening filter for better clarity
      applySharpening(ctx, finalCanvas.width, finalCanvas.height);

      // Generate both HTML output and direct image
      createEmailCompatibleHTML(finalCanvas);

      // Cleanup
      document.body.removeChild(loadingDiv);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Capture failed. Check console for details.");
      document.body.removeChild(loadingDiv);
    });
}

function createEmailCompatibleHTML(canvas) {
  // Get the original canvas dimensions
  const originalWidth = canvas.width;
  const originalHeight = canvas.height;

  // Generate optimized JPEG (slightly lower quality for better compatibility)
  const imgData = canvas.toDataURL("image/jpeg", 0.9);

  // Create HTML specifically optimized for Outlook's quirky rendering
  const htmlContent = createFullWidthHTML(imgData);
  const paddedHtmlContent = createPaddedWidthHTML(imgData);

  // Create HTML download
  const htmlBlob = new Blob([htmlContent], { type: "text/html" });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  const htmlLink = document.createElement("a");
  htmlLink.href = htmlUrl;
  htmlLink.download = "outlook-compatible-report.html";

  // Create HTML with padding download
  const paddedHtmlBlob = new Blob([paddedHtmlContent], { type: "text/html" });
  const paddedHtmlUrl = URL.createObjectURL(paddedHtmlBlob);
  const paddedHtmlLink = document.createElement("a");
  paddedHtmlLink.href = paddedHtmlUrl;
  paddedHtmlLink.download = "outlook-compatible-report-with-padding.html";

  // Create direct image download option
  const imgLink = document.createElement("a");
  imgLink.href = imgData;
  imgLink.download = "report-image.jpg";

  // Create a container for download options
  const downloadOptions = document.createElement("div");
  downloadOptions.style.position = "fixed";
  downloadOptions.style.bottom = "20px";
  downloadOptions.style.right = "20px";
  downloadOptions.style.padding = "20px 25px";
  downloadOptions.style.background = "white";
  downloadOptions.style.border = "1px solid #e0e0e0";
  downloadOptions.style.borderRadius = "12px";
  downloadOptions.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
  downloadOptions.style.zIndex = "9999";
  downloadOptions.style.width = "340px";
  downloadOptions.style.fontFamily = "Arial, sans-serif";
  downloadOptions.style.transition = "all 0.3s ease";

  // Add crimson accent bar at the top
  const accentBar = document.createElement("div");
  accentBar.style.position = "absolute";
  accentBar.style.top = "0";
  accentBar.style.left = "0";
  accentBar.style.width = "100%";
  accentBar.style.height = "4px";
  accentBar.style.background = "#dc143c";
  accentBar.style.borderTopLeftRadius = "12px";
  accentBar.style.borderTopRightRadius = "12px";
  downloadOptions.appendChild(accentBar);

  // Add title with logo icon
  const titleContainer = document.createElement("div");
  titleContainer.style.display = "flex";
  titleContainer.style.alignItems = "center";
  titleContainer.style.marginBottom = "16px";
  titleContainer.style.paddingTop = "5px";

  // Logo/icon (using a simple download icon with your brand color)
  const iconSpan = document.createElement("span");
  iconSpan.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc143c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `;
  titleContainer.appendChild(iconSpan);

  // Title text
  const title = document.createElement("h3");
  title.textContent = "Download Options";
  title.style.margin = "0 0 0 10px";
  title.style.fontSize = "17px";
  title.style.fontWeight = "600";
  title.style.color = "#333";
  titleContainer.appendChild(title);
  downloadOptions.appendChild(titleContainer);

  // Add instructions with improved formatting
  const instructions = document.createElement("div");
  instructions.innerHTML = `
    <div style="padding: 12px 15px; background: #f7f7f7; border-radius: 8px; margin-bottom: 15px;">
      <p style="font-size: 14px; margin: 0 0 12px 0; line-height: 1.5; color: #444;">
        <strong style="color: #dc143c; font-size: 15px;">For Outlook Classic & Web:</strong>
      </p>
      <ol style="margin: 0; padding-left: 18px; font-size: 13px; color: #555; line-height: 1.6;">
        <li>Download the HTML file</li>
        <li>Open in a browser</li>
        <li>Copy everything (<strong>Ctrl+A, Ctrl+C</strong>)</li>
        <li>In Outlook, paste with <strong>"Keep Source Formatting"</strong></li>
        <li><strong style="color: #dc143c;">Important:</strong> Send it from Outlook Classic Version</li>
      </ol>
    </div>
  `;
  downloadOptions.appendChild(instructions);

  // Create a reusable button function with improved styling
  const createButton = (
    text,
    onClick,
    isPrimary = false,
    marginTop = "10px"
  ) => {
    const button = document.createElement("button");
    button.textContent = text;
    button.style.display = "block";
    button.style.width = "100%";
    button.style.padding = "12px 0";
    button.style.background = isPrimary ? "#dc143c" : "white";
    button.style.color = isPrimary ? "white" : "#444";
    button.style.border = isPrimary ? "none" : "1px solid #d1d1d1";
    button.style.borderRadius = "6px";
    button.style.cursor = "pointer";
    button.style.transition = "all 0.2s ease";
    button.style.marginTop = marginTop;
    button.style.fontWeight = isPrimary ? "600" : "normal";
    button.style.fontSize = "14px";
    button.style.boxShadow = isPrimary
      ? "0 2px 6px rgba(220, 20, 60, 0.3)"
      : "none";

    button.onmouseover = () => {
      if (isPrimary) {
        button.style.background = "#c01236";
        button.style.boxShadow = "0 3px 8px rgba(220, 20, 60, 0.4)";
      } else {
        button.style.background = "#f7f7f7";
        button.style.borderColor = "#c4c4c4";
      }
    };

    button.onmouseout = () => {
      if (isPrimary) {
        button.style.background = "#dc143c";
        button.style.boxShadow = "0 2px 6px rgba(220, 20, 60, 0.3)";
      } else {
        button.style.background = "white";
        button.style.borderColor = "#d1d1d1";
      }
    };

    button.onclick = onClick;
    downloadOptions.appendChild(button);
    return button;
  };

  // Add HTML option button with primary styling
  createButton(
    "Download Full Width HTML",
    () => {
      document.body.appendChild(htmlLink);
      htmlLink.click();
      document.body.removeChild(htmlLink);
    },
    true
  );

  // Add new HTML with padding option button
  createButton(
    "Download Centered Width HTML",
    () => {
      document.body.appendChild(paddedHtmlLink);
      paddedHtmlLink.click();
      document.body.removeChild(paddedHtmlLink);
    },
    false,
    "10px"
  );

  // Add Image option button
  createButton(
    "Download Image Only",
    () => {
      document.body.appendChild(imgLink);
      imgLink.click();
      document.body.removeChild(imgLink);
    },
    false,
    "10px"
  );

  // Add close button with secondary styling
  createButton(
    "Close",
    () => {
      document.body.removeChild(downloadOptions);
    },
    false,
    "12px"
  );

  // Add to document
  document.body.appendChild(downloadOptions);
}

// Function for full width HTML (original)
function createFullWidthHTML(imgData) {
  return `
  <!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Report</title>
    <style type="text/css">
        /* Reset Styles */
        html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
        }
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
            box-sizing: border-box;
        }
        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }
        table, td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
            border-collapse: collapse !important;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            display: block;
        }
        #outlook a {
            padding: 0;
        }
        .ExternalClass {
            width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }
    </style>
</head>
<body style="margin:0;padding:0;width:100% !important;background-color:#ffffff;" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    <!-- MSO Wrapper -->
    <!--[if mso]>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0;padding:0;">
        <tr>
            <td style="padding:0;">
    <![endif]-->
    
    <!-- Main Container -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100% !important;margin:0;padding:0;border-spacing:0;border-collapse:collapse;">
        <tr>
            <td align="center" valign="top" style="padding:0;margin:0;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100% !important;margin:0;padding:0;border-spacing:0;border-collapse:collapse;table-layout:fixed;">
                    <tr>
                        <td style="padding:0;margin:0;font-size:0;line-height:0;">
                            <!-- Outlook VML -->
                            <!--[if mso]>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding:0;margin:0;">
                                        <v:group xmlns:v="urn:schemas-microsoft-com:vml" coordsize="100,100" style="width:100%;position:relative;">
                                            <v:rect fill="true" stroke="false" style="position:absolute;width:100%;height:auto;left:0;top:0;">
                                                <v:fill type="frame" src="${imgData}" />
                                            </v:rect>
                                        </v:group>
                                    </td>
                                </tr>
                            </table>
                            <![endif]-->
                            
                            <!-- Standard Image (Non-Outlook) -->
                            <!--[if !mso]><!-->
                            <div style="font-size:0;line-height:0;">
                                <img src="${imgData}" 
                                     width="100%" 
                                     style="width:100% !important;max-width:100% !important;min-width:100% !important;height:auto !important;display:block !important;margin:0 !important;padding:0 !important;border:0;outline:none;text-decoration:none;vertical-align:bottom;" 
                                     alt="Report">
                            </div>
                            <!--<![endif]-->
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    
    <!--[if mso]>
            </td>
        </tr>
    </table>
    <![endif]-->
</body>
</html>
  `.replace(/\>\s+\</g, "><");
}

// Function for padded HTML (2/3 width, centered)
function createPaddedWidthHTML(imgData) {
  return `
  <!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Report</title>
    <style type="text/css">
        /* Reset Styles */
        html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
        }
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
            box-sizing: border-box;
        }
        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }
        table, td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
            border-collapse: collapse !important;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            display: block;
        }
        #outlook a {
            padding: 0;
        }
        .ExternalClass {
            width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }
    </style>
</head>
<body style="margin:0;padding:0;width:100% !important;background-color:#ffffff;" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    <!-- Outer Table with Fixed Width and Auto Margins -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100% !important;margin:0;padding:0;border-spacing:0;border-collapse:collapse;">
        <tr>
            <td align="center" valign="top" style="padding:0;margin:0;">
                <!-- Content Wrapper Table with Side Padding -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100% !important;max-width:1000px;margin:0 auto;border-spacing:0;border-collapse:collapse;">
                    <tr>
                        <td style="padding:0 10px;">
                            <!-- Content Table -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100% !important;margin:0;padding:0;border-spacing:0;border-collapse:collapse;table-layout:fixed;">
                                <tr>
                                    <td style="padding:0;margin:0;font-size:0;line-height:0;">
                                        <!-- Outlook VML -->
                                        <!--[if mso]>
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" style="padding:0;margin:0;">
                                                    <v:group xmlns:v="urn:schemas-microsoft-com:vml" coordsize="100,100" style="width:100%;position:relative;">
                                                        <v:rect fill="true" stroke="false" style="position:absolute;width:100%;height:auto;left:0;top:0;">
                                                            <v:fill type="frame" src="${imgData}" />
                                                        </v:rect>
                                                    </v:group>
                                                </td>
                                            </tr>
                                        </table>
                                        <![endif]-->
                                        
                                        <!-- Standard Image (Non-Outlook) -->
                                        <!--[if !mso]><!-->
                                        <div style="font-size:0;line-height:0;">
                                            <img src="${imgData}" 
                                                 width="100%" 
                                                 style="width:100% !important;max-width:100% !important;min-width:100% !important;height:auto !important;display:block !important;margin:0 !important;padding:0 !important;border:0;outline:none;text-decoration:none;vertical-align:bottom;" 
                                                 alt="Report">
                                        </div>
                                        <!--<![endif]-->
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `.replace(/\>\s+\</g, "><");
}

// Function to apply sharpening to canvas context
function applySharpening(ctx, width, height) {
  try {
    // Get image data
    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    const tempPixels = new Uint8ClampedArray(pixels);

    // Simple sharpening kernel
    // Skip edge pixels to avoid out-of-bounds
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        // Apply sharpening for RGB channels (skip alpha)
        for (let c = 0; c < 3; c++) {
          const currentPixel = tempPixels[idx + c];
          const neighbors = [
            tempPixels[idx - width * 4 + c], // top
            tempPixels[idx - 4 + c], // left
            tempPixels[idx + 4 + c], // right
            tempPixels[idx + width * 4 + c], // bottom
          ];

          // Sharpening calculation: 5*current - sum(neighbors)
          let sharpened =
            5 * currentPixel - neighbors.reduce((a, b) => a + b, 0);

          // Clamp values to valid range
          pixels[idx + c] = Math.min(255, Math.max(0, sharpened));
        }
      }
    }

    // Put the modified pixels back
    ctx.putImageData(imgData, 0, 0);
  } catch (e) {
    console.warn("Sharpening filter could not be applied:", e);
    // Continue without sharpening if it fails
  }
}

let downloadButton = document.getElementById("download-button");
let downloadSelect = document.getElementById("downloadSelect");
downloadButton.addEventListener("click", () => {
  let selectedValue = downloadSelect.value;
  if (selectedValue === "html") {
    captureAndDownload();
  }
});

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

// Function to handle table-based image layout for Outlook
function captureAndDownloadAsTable() {
  // Show loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.textContent = "Processing Table Format...";
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

  // Get file input element
  const fileInput = document.getElementById("imageInput");
  if (!fileInput.files || fileInput.files.length === 0) {
    // alert('Please select image files first');
    showAlert("Please select image files first");
    document.body.removeChild(loadingDiv);
    return;
  }

  // Process selected files
  processImageFiles(fileInput.files)
    .then((processedImages) => {
      // Sort images by part number
      const sortedImages = sortImagesByPart(processedImages);

      // Generate HTML content with table layout
      const htmlContent = generateTableBasedHTML(sortedImages);

      // Create HTML download
      const htmlBlob = new Blob([htmlContent], { type: "text/html" });
      const htmlUrl = URL.createObjectURL(htmlBlob);
      const htmlLink = document.createElement("a");
      htmlLink.href = htmlUrl;
      htmlLink.download = "report-table-layout.html";

      // Show download options
      showDownloadOptions(htmlLink);

      // Remove loading indicator
      document.body.removeChild(loadingDiv);
    })
    .catch((error) => {
      console.error("Error processing images:", error);
      alert("Failed to process images. Check console for details.");
      document.body.removeChild(loadingDiv);
    });
}

// Process all image files
function processImageFiles(files) {
  return new Promise((resolve, reject) => {
    const processedImages = [];
    let processedCount = 0;

    // Convert FileList to Array for easier handling
    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      // Check if file is an image
      if (!file.type.match("image.*")) {
        processedCount++;
        if (processedCount === fileArray.length) {
          resolve(processedImages);
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          // Extract part number from filename
          const partMatch = file.name.match(
            /Japanese-Training-Report-part-(\d+)/
          );
          const partNumber = partMatch ? parseInt(partMatch[1]) : 999; // Default high number if no match

          // Create canvas for image processing
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");

          // Draw image
          ctx.drawImage(img, 0, 0);

          // Apply sharpening
          applyTableImageSharpening(ctx, img.width, img.height);

          // Get optimized data URL
          const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.92);

          // Store processed image data
          processedImages.push({
            partNumber: partNumber,
            dataUrl: optimizedDataUrl,
            width: img.width,
            height: img.height,
            fileName: file.name,
          });

          // Check if all images are processed
          processedCount++;
          if (processedCount === fileArray.length) {
            resolve(processedImages);
          }
        };

        img.onerror = function () {
          console.error("Error loading image:", file.name);
          processedCount++;
          if (processedCount === fileArray.length) {
            resolve(processedImages);
          }
        };

        img.src = e.target.result;
      };

      reader.onerror = function () {
        console.error("Error reading file:", file.name);
        reject(new Error(`Failed to read file: ${file.name}`));
      };

      reader.readAsDataURL(file);
    });

    // Handle empty file list
    if (fileArray.length === 0) {
      reject(new Error("No files selected"));
    }
  });
}

// Sort images by part number
function sortImagesByPart(images) {
  return images.sort((a, b) => a.partNumber - b.partNumber);
}

// Apply sharpening to table images
function applyTableImageSharpening(ctx, width, height) {
  try {
    // Get image data
    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    const tempPixels = new Uint8ClampedArray(pixels);

    // Skip edge pixels to avoid out-of-bounds
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        // Apply sharpening for RGB channels (skip alpha)
        for (let c = 0; c < 3; c++) {
          const currentPixel = tempPixels[idx + c];
          const neighbors = [
            tempPixels[idx - width * 4 + c], // top
            tempPixels[idx - 4 + c], // left
            tempPixels[idx + 4 + c], // right
            tempPixels[idx + width * 4 + c], // bottom
          ];

          // Sharpening calculation: 5*current - sum(neighbors)
          let sharpened =
            5 * currentPixel - neighbors.reduce((a, b) => a + b, 0);

          // Clamp values to valid range
          pixels[idx + c] = Math.min(255, Math.max(0, sharpened));
        }
      }
    }

    // Put the modified pixels back
    ctx.putImageData(imgData, 0, 0);
  } catch (e) {
    console.warn("Sharpening filter could not be applied:", e);
    // Continue without sharpening if it fails
  }
}
////////////////////////
function generateTableBasedHTML(images) {
  let allImagesHTML = images
    .map(
      (image) => `
    <div style="display:block;font-size:0;line-height:0;margin:0;padding:0;width:100%">
      <!--[if mso]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:100%;">
        <v:fill src="${image.dataUrl}" type="frame" />
      </v:rect>
      <![endif]-->
      <img src="${image.dataUrl}" 
           width="100%" 
           alt=""
           style="display:block;width:100%;max-width:100%;height:auto;
                  margin:0;padding:0;border:0;outline:none;
                  text-decoration:none;font-size:0;line-height:0;"
           border="0" />
    </div>
  `
    )
    .join("")
    .replace(/\>\s+\</g, "><"); // Remove whitespace between containers

  return `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Outlook Web Fixes */
    .ExternalClass { width: 100%; display: block !important; }
    div, img { border: 0 !important; margin: 0 !important; padding: 0 !important; line-height: 0 !important; font-size: 0 !important; }
    table { border-collapse: collapse !important; mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
  </style>
</head>
<body style="margin:0;padding:0;background:#fff">
  <!--[if mso]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;">
    <tr>
      <td>
  <![endif]-->
  <div style="width:100%;max-width:100%;margin:0;padding:0;font-size:0;line-height:0">
    ${allImagesHTML}
  </div>
  <!--[if mso]>
      </td>
    </tr>
  </table>
  <![endif]-->
</body>
</html>
  `.replace(/\>\s+\</g, "><");
}
// Show download options (continued)
function showDownloadOptions(htmlLink) {
  // Create a container for download options
  // Create a container for download options
  const downloadOptions = document.createElement("div");
  downloadOptions.style.position = "fixed";
  downloadOptions.style.bottom = "20px";
  downloadOptions.style.right = "20px";
  downloadOptions.style.padding = "20px 25px";
  downloadOptions.style.background = "white";
  downloadOptions.style.border = "1px solid #e0e0e0";
  downloadOptions.style.borderRadius = "12px";
  downloadOptions.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
  downloadOptions.style.zIndex = "9999";
  downloadOptions.style.width = "340px";
  downloadOptions.style.fontFamily = "Arial, sans-serif";
  downloadOptions.style.transition = "all 0.3s ease";

  // Add crimson accent bar at the top
  const accentBar = document.createElement("div");
  accentBar.style.position = "absolute";
  accentBar.style.top = "0";
  accentBar.style.left = "0";
  accentBar.style.width = "100%";
  accentBar.style.height = "4px";
  accentBar.style.background = "#dc143c";
  accentBar.style.borderTopLeftRadius = "12px";
  accentBar.style.borderTopRightRadius = "12px";
  downloadOptions.appendChild(accentBar);

  // Add title with logo icon
  const titleContainer = document.createElement("div");
  titleContainer.style.display = "flex";
  titleContainer.style.alignItems = "center";
  titleContainer.style.marginBottom = "16px";
  titleContainer.style.paddingTop = "5px";

  // Logo/icon (using a simple download icon with your brand color)
  const iconSpan = document.createElement("span");
  iconSpan.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc143c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `;
  titleContainer.appendChild(iconSpan);

  // Title text
  const title = document.createElement("h3");
  title.textContent = "Download Options";
  title.style.margin = "0 0 0 10px";
  title.style.fontSize = "17px";
  title.style.fontWeight = "600";
  title.style.color = "#333";
  titleContainer.appendChild(title);
  downloadOptions.appendChild(titleContainer);

  // Add instructions with improved formatting
  const instructionsDiv = document.createElement("div");
  instructionsDiv.innerHTML = `
    <div style="padding: 12px 15px; background: #f7f7f7; border-radius: 8px; margin-bottom: 15px;">
      <p style="font-size: 14px; margin: 0 0 12px 0; line-height: 1.5; color: #444;">
        <strong style="color: #dc143c; font-size: 15px;">For Outlook Classic & Web:</strong>
      </p>
      <ol style="margin: 0; padding-left: 18px; font-size: 13px; color: #555; line-height: 1.6;">
        <li>Download the HTML file</li>
        <li>Open in a browser</li>
        <li>Copy everything (<strong>Ctrl+A, Ctrl+C</strong>)</li>
        <li>In Outlook, paste with <strong>"Keep Source Formatting"</strong></li>
        <li><strong style="color: #dc143c;">Important:</strong> Send it from Outlook Classic Version</li>
      </ol>
    </div>
  `;
  downloadOptions.appendChild(instructionsDiv);

  // Create a reusable button function with improved styling
  const createButton = (
    text,
    onClick,
    isPrimary = false,
    marginTop = "10px"
  ) => {
    const button = document.createElement("button");
    button.textContent = text;
    button.style.display = "block";
    button.style.width = "100%";
    button.style.padding = "12px 0";
    button.style.background = isPrimary ? "#dc143c" : "white";
    button.style.color = isPrimary ? "white" : "#444";
    button.style.border = isPrimary ? "none" : "1px solid #d1d1d1";
    button.style.borderRadius = "6px";
    button.style.cursor = "pointer";
    button.style.transition = "all 0.2s ease";
    button.style.marginTop = marginTop;
    button.style.fontWeight = isPrimary ? "600" : "normal";
    button.style.fontSize = "14px";
    button.style.boxShadow = isPrimary
      ? "0 2px 6px rgba(220, 20, 60, 0.3)"
      : "none";

    button.onmouseover = () => {
      if (isPrimary) {
        button.style.background = "#c01236";
        button.style.boxShadow = "0 3px 8px rgba(220, 20, 60, 0.4)";
      } else {
        button.style.background = "#f7f7f7";
        button.style.borderColor = "#c4c4c4";
      }
    };

    button.onmouseout = () => {
      if (isPrimary) {
        button.style.background = "#dc143c";
        button.style.boxShadow = "0 2px 6px rgba(220, 20, 60, 0.3)";
      } else {
        button.style.background = "white";
        button.style.borderColor = "#d1d1d1";
      }
    };

    button.onclick = onClick;
    downloadOptions.appendChild(button);
    return button;
  };

  // Add HTML option button with primary styling
  createButton(
    "Download Table Format",
    () => {
      document.body.appendChild(htmlLink);
      htmlLink.click();
      document.body.removeChild(htmlLink);
      document.body.removeChild(downloadOptions);
    },
    true
  );

  // Add close button with secondary styling
  createButton(
    "Close",
    () => {
      document.body.removeChild(downloadOptions);
    },
    false,
    "12px"
  );

  // Add to document
  document.body.appendChild(downloadOptions);
}

// Add event listener for the download button
let downloadButtonTable = document.getElementById("download-button");
let downloadSelectTable = document.getElementById("downloadSelect");

downloadButtonTable.addEventListener("click", () => {
  let selectedValue = downloadSelectTable.value;
  if (selectedValue === "table") {
    captureAndDownloadAsTable();
  }
});

// Optional: Add file input for selecting multiple image files
// You can add this HTML element to your page:
// <input type="file" id="imageInput" multiple accept="image/*" style="display: none;">
