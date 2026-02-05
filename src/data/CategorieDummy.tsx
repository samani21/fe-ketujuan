import { CategorieType } from "@/types/CategorieProduct";
import { Coffee, Croissant, Leaf } from "lucide-react";

export const CategorieDummy: CategorieType[] = [
  {
    id: 1,
    name: "Coffee",
    icon: <Coffee size={16} />,
  },
  {
    id: 2,
    name: "Non-Coffee",
    icon: <Leaf size={16} />,
  },
  {
    id: 3,
    name: "Pastry",
    icon: <Croissant size={16} />,
  },
];
