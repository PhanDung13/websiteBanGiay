import { useHistory, useLocation } from "react-router-dom";

const useCustomRouter = () => {
  const history = useHistory();
  const { pathname, search } = useLocation();

  const pushQuery = ({ page, sort, category }) => {
    const query = {};

    if (page) query.page = page;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    console.log(category);
    const newQuery = new URLSearchParams(query).toString();

    history.push(`${pathname}?${newQuery}`);
  };

  return { pushQuery };
};

export default useCustomRouter;
