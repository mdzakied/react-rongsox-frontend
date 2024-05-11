import { Button } from "primereact/button";

export default function Admin() {
  return (
    <>
      <section id="adminPage">
        <div className="flex flex-row justify-content-between align-items-center">
          <div>
            {/* Title */}
            <div>
              <span className="text-2xl font-medium">Admin</span>
            </div>
            {/* Subtitle */}
            <div>
              <span className="text-xs font-medium text-gray-500">
                List of users registered as admin on Rongsox
              </span>
            </div>
          </div>
          <div>
            {/* Title */}
            {/* Login Button */}
            <div className="pl-4">
              <Button
                label={"Add"}
                className="bgn-success"
                severity="success"
                size="small"
                icon="pi pi-plus-circle"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
