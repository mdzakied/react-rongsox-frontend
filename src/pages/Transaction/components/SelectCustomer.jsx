import { Dropdown } from "primereact/dropdown";
import { useQuery } from "@tanstack/react-query";

import PropTypes from "prop-types";

import UserService from "@services/UserService";

// use service and utils with useMemo -> prevent re-render
const userService = UserService();

export default function SelectCustomer({selectedCustomer, handleSelectedCustomer}) {

  // get all customer -> react query
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      return await userService.getAllCustomer({
        size: 1000
      });
    },
  });

  // customers data
  const customers = data?.data;

  return (
    <div>
      <div className="card flex justify-content-end">
        <Dropdown
          value={selectedCustomer}
          onChange={(e) => handleSelectedCustomer(e.value)}
          options={customers}
          optionLabel="name"
          placeholder="Select a customer"
          filter
          className="w-full md:w-14rem border-0 shadow-3"
          loading={isLoading}
          showClear
        />
      </div>
    </div>
  );
}

SelectCustomer.propTypes = {
  selectedCustomer: PropTypes.object,
  handleSelectedCustomer: PropTypes.func
};
