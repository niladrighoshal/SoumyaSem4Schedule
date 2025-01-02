// Schedule Data
const schedule = {
    "M\nO\nN": ["", "", "", "Applied\nPhysics\n(YB)\n(L)", "Applied\nPhysics\n(YB)\n(L)", "", ""],
    "T\nU\nE": ["Applied\nPhysics\n(YB)\n(L)", "Astro\nPhysics\n(SM)\n(H)", "", "Observational Astronomy\n(Lab)\n(TRS) (SP)"],
    "W\nE\nD": ["Applied\nPhysics\n(YB)\n(L)", "Astro\nPhysics\n(SM)\n(H)", "Atomic &\nMolecular\nPhysics\n(Tutorial)\n(GDS)\n(H)", "Observational Astronomy\n(Lab)\n(TRS) (SP)"],
    "T\nH\nU": ["", "Astro\nPhysics\n(SM)\n(H)", "Atomic &\nMolecular\nPhysics\n(PS)(JR)\n(DSKL)", "", "", "GTR &\nCosmology\n(SS)\n(L)", ""],
    "F\nR\nI": ["", "Astro\nPhysics\n(SM)\n(H)", "Atomic &\nMolecular\nPhysics\n(PS)(JR)\n(DSKL)", "", "", "GTR &\nCosmology\n(SS)\n(L)", ""],
    "S\nA\nT": ["", "", "Atomic &\nMolecular\nPhysics\n(PS)(JR)\n(DSKL)", "", "", "GTR &\nCosmology\n(SS)\n(L)", "GTR &\nCosmology\n(SS)\n(L)"]
  };
  
  // Subject Durations
  const subjectDurations = {
    "Applied\nPhysics\n(YB)\n(L)": 1,
    "Astro\nPhysics\n(SM)\n(H)": 1,
    "Atomic &\nMolecular\nPhysics\n(Tutorial)\n(GDS)\n(H)": 1,
    "Atomic &\nMolecular\nPhysics\n(PS)(JR)\n(DSKL)": 1,
    "GTR &\nCosmology\n(SS)\n(L)": 1,
    "Observational Astronomy\n(Lab)\n(TRS) (SP)": 4,
  };
  
  // Subject Classes
  const subjectClasses = {
    "Applied\nPhysics\n(YB)\n(L)": "subject-applied",
    "Astro\nPhysics\n(SM)\n(H)": "subject-astro",
    "Atomic &\nMolecular\nPhysics\n(Tutorial)\n(GDS)\n(H)": "subject-atomic",
    "Atomic &\nMolecular\nPhysics\n(PS)(JR)\n(DSKL)": "subject-atomic",
    "GTR &\nCosmology\n(SS)\n(L)": "subject-gtr",
    "Observational Astronomy\n(Lab)\n(TRS) (SP)": "subject-obs",
  };
  
  // Populate Schedule
  const tbody = document.querySelector("#schedule tbody");
  Object.keys(schedule).forEach((day) => {
    const row = document.createElement("tr");
    const dayCell = document.createElement("td");
    dayCell.textContent = day;
    dayCell.classList.add("day-header");
    row.appendChild(dayCell);
  
    schedule[day].forEach((subject, index) => {
      if (subjectDurations[subject] > 1) {
        const cell = document.createElement("td");
        cell.textContent = subject;
        cell.setAttribute("colspan", subjectDurations[subject]);
        cell.classList.add(subjectClasses[subject]);
        row.appendChild(cell);
        for (let i = 1; i < subjectDurations[subject]; i++) schedule[day][index + i] = null;
      } else if (subject) {
        const cell = document.createElement("td");
        cell.textContent = subject;
        cell.classList.add(subjectClasses[subject]);
        row.appendChild(cell);
      } else {
        const emptyCell = document.createElement("td");
        row.appendChild(emptyCell);
      }
    });
  
    tbody.appendChild(row);
  });
  
  // Highlight Today's Row
  const days = ["M\nO\nN", "T\nU\nE", "W\nE\nD", "T\nH\nU", "F\nR\nI", "S\nA\nT"];
  const today = days[new Date().getDay() - 1];
  
    // testing all dates
          // const today = "M\nO\nN";
        //   const today = "T\nU\nE";
        //   const today = "W\nE\nD";
        //   const today = "T\nH\nU";
          // const today = "F\nR\nI";
        //   const today = "S\nA\nT";
  
  [...tbody.rows].forEach((row) => {
    if (row.cells[0].textContent === today) {
      row.classList.add("highlight");
    }
  });
  
  // Calculate Free Time
  const calculateFreeTime = (day) => {
    const daySchedule = schedule[day];
    const freePeriods = [];
    let startFree = null;

    // Loop through each slot in the day's schedule
    for (let i = 0; i < daySchedule.length; i++) {
        const subject = daySchedule[i];

        if (subject) {
            // If a subject is found and we were tracking free time, close that free period
            if (startFree !== null) {
                freePeriods.push([startFree, i - 1]);
                startFree = null;
            }
            // If the subject duration is greater than 1, we skip the next slots accordingly
            if (subjectDurations[subject] > 1) {
                i += subjectDurations[subject] - 1;  // Skip slots for multi-period classes
            }
        } else {
            // If no subject, we are in a free period
            if (startFree === null) {
                startFree = i; // Mark the start of free period
            }
        }
    }

    // If we ended with a free period at the end of the day
    if (startFree !== null) {
        freePeriods.push([startFree, daySchedule.length - 1]);
    }

    // Now format the free periods to return a readable string
    return freePeriods
        .map(([start, end]) => {
            const startTime = ["10:00 AM", "11:00 AM", "12:10 PM", "1:30 PM", "2:30 PM", "3:30 PM", "4:30 PM"][start];
            const endTime = ["11:00 AM", "12:00 PM", "1:10 PM", "2:30 PM", "3:30 PM", "4:30 PM", "5:30 PM"][end];

            // Special handling for 5:30 PM end time
            if (startTime === "10:00 AM") {
                return `Before ${endTime}`;
            } else if (endTime === "5:30 PM" && startTime !== "10:00 AM") {
                return `Then again after ${startTime}`;
            } else {
                return `In between ${startTime} and ${endTime}`;
            }
        })
        .join("\n");
};
  
  // Display Free Time
  document.querySelector("#free-time").textContent = `Today I am free during:\n${calculateFreeTime(today)}`;