import { cn } from "@/lib/utils";
import { Chart, registerables } from "chart.js";
import { FileText, Settings, University } from "lucide-react";
import { useEffect } from "react";

// Register all necessary components
Chart.register(...registerables);

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <DocumentCounter className="col-span-1" />
      <InstituteCounter className="col-span-1" />
      <TopInstitutes className="col-span-2" />
      <DocumentPerInstituteGraph className="col-span-2" />
    </div>
  );
};

const DocumentCounter = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 bg-slate-800 text-white p-6 rounded-md text-center",
        className
      )}
    >
      <h1 className="text-3xl font-semibold flex items-center justify-center gap-1">
        <FileText className="w-7 h-7" /> 10
      </h1>
      <h1 className="text-xl font-semibold">
        Documents Uploaded In The Platform So Far
      </h1>
      <button className="flex items-center justify-center gap-1">
        <Settings className="w-4 h-4" /> manage {">"}
      </button>
    </div>
  );
};

const InstituteCounter = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 bg-slate-800 text-white p-6 rounded-md text-center",
        className
      )}
    >
      <h1 className="text-3xl font-semibold flex items-center justify-center gap-1">
        <University className="w-7 h-7" /> 755
      </h1>
      <h1 className="text-xl font-semibold">
        Institutes Registered In The Platform So Far
      </h1>
      <button className="flex items-center justify-center gap-1">
        <Settings className="w-4 h-4" /> manage {">"}
      </button>
    </div>
  );
};

const TopInstitutes = ({ className }: { className?: string }) => {
  return (
    <div className={cn("bg-slate-800 text-white p-6 rounded-md", className)}>
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        {" "}
        <University className="w-6 h-6" /> Top Institutes
      </h1>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <InstituteCard />
        <InstituteCard />
        <InstituteCard />
      </div>
    </div>
  );
};

const InstituteCard = () => {
  return (
    <div className="bg-slate-700 p-4 rounded-md">
      <h1 className="text-xl font-semibold">Institute Name</h1>
      <p className="text-sm">City, Gouvernorate</p>
      <p className="text-sm">Website</p>
    </div>
  );
};

const DocumentPerInstituteGraph = ({ className }: { className?: string }) => {
  useEffect(() => {
    const ctx = document.getElementById(
      "documentsPerInstituteGraph"
    ) as HTMLCanvasElement;
    if (!ctx) return;

    let myChart: Chart | null = null;

    if (Chart.getChart(ctx)) {
      Chart.getChart(ctx)?.destroy();
    }

    myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Institute 1", "Institute 2", "Institute 3", "Institute 4"],
        datasets: [
          {
            label: "Documents",
            data: [12, 19, 3, 5],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],

            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            ticks: {
              color: "white", // Change x-axis text color to white
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "white", // Change y-axis text color to white
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "white", // Change legend text color to white
            },
          },
        },
      },
    });

    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, []);

  return (
    <div className={cn(className, "bg-slate-800 text-white rounded-md")}>
      <canvas
        id="documentsPerInstituteGraph"
        style={{
          height: "100px",
        }}
      ></canvas>
    </div>
  );
};

export default AdminDashboard;
