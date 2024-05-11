import { Link } from "react-router-dom";

import { Button } from "primereact/button";

import errorImage500 from "@assets/images/error-500.png";

function Error500() {
  return (
    <>
      {/* Error Section */}
      <section id="error500">
        <div className="flex flex-row gird align-items-center  justify-content-center h-screen border-1">
          <div className="gird text-center">
            {/* Image */}
            <div className="col-12 p-0">
              <img
                src={errorImage500}
                alt="500"
                className="w-20rem md:w-28rem"
              />
            </div>
            {/* Button */}
            <div className="col-12 p-0">
              <Link to="/dashboard">
                <Button
                  label="Back To Home"
                  className="bgn-success btn-error"
                  severity="success"
                  size="small"
                  style={{position: "relative", top: "-2rem"}}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Error500;
