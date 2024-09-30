import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Controls, Filters } from "../../components/UI";
import { GridLayout } from "../../layouts";
import { ApiResponse } from "../../types/recipes";
import "./Recipes.css";

const getRecipes = async (
  page: number,
  category: string | null,
  area: string | null,
  search: string | null
): Promise<ApiResponse> => {
  try {
    const res = await fetch(
      `http://localhost:3000/recipes?page=${page}&category=${category || ""}&area=${area || ""}&search=${search || ""}`
    );
    if (!res.ok) {
      const errorData = await res.json();
      const errorMessage = errorData.message || "Network Error";
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
};

const Recipes = () => {
  /* Initialize search params hook  */
  const [searchParams, setSearchParams] = useSearchParams();

  /* Get params from URL */
  const qPage = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category");
  const area = searchParams.get("area");
  const qSearch = searchParams.get("search");

  /* State for handling current page */
  const [page, setPage] = useState(qPage);

  /* State for handling search input */
  const [search, setSearch] = useState<string | null>(qSearch);

  /* Recipes Fetching */
  const { data, error, isLoading } = useQuery({
    queryKey: ["recipes", page, category, area, search],
    queryFn: () => getRecipes(page, category, area, search),
  });

  // Update search params when page changes
  useEffect(() => {
    setSearchParams({
      page: String(page),
      category: category || "",
      area: area || "",
      search: search || "",
    });
  }, [page, category, area, search, setSearchParams]);

  /* Reset page value when Select changes */
  const handleFilterChange = () => {
    setPage(1);
  };

  return (
    <section className="recipes__container">
      <h1>Recipes for Every Occasion</h1>
      <Filters
        pagination={data?.pagination}
        onFilterChange={handleFilterChange}
        search={search}
        setSearch={setSearch}
      />
      <GridLayout data={data} loading={isLoading} error={error} />
      <Controls pagination={data?.pagination} setPage={setPage} />
    </section>
  );
};

export default Recipes;
