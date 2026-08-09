import { Button } from "@/components/ui/button";
import PageHeader from "../_components/pageHeader";
import Link from "next/link";
import { MoreVertical, Plus, Tag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteItemComp2 } from "../menuItems/_components/productsActions";
import db from "@/db/db";

export default async function Items() {
  const categories = await db.types.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { items: true } },
    },
  });

  return (
    <div className="lg:flex justify-center">
      <div className="w-full lg:w-[80%] p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <PageHeader>Menu Categories</PageHeader>
            <p className="mt-1 text-sm text-stone-500">
              {categories.length} categor{categories.length === 1 ? "y" : "ies"}
            </p>
          </div>
          <Link href="/admin/menuCategories/new">
            <Button variant="mainButton" size="md" className="gap-1.5">
              <Plus size={16} /> Add category
            </Button>
          </Link>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          {categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Items</th>
                    <th className="w-0 px-5 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categories.map((cate) => (
                    <tr key={cate?.id} className="transition-colors hover:bg-stone-50/70">
                      <td className="px-5 py-3 font-medium text-stone-800">{cate?.name}</td>
                      <td className="px-5 py-3">
                        <span className="inline-block rounded-md bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                          {cate._count.items} item{cate._count.items === 1 ? "" : "s"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700">
                            <span className="sr-only">Actions</span>
                            <MoreVertical size={16} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DeleteItemComp2 id={cate?.id} disabled={cate._count.items > 0} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                <Tag size={22} />
              </div>
              <div>
                <p className="font-semibold text-stone-800">No categories yet</p>
                <p className="mt-1 text-sm text-stone-500">
                  Categories group your menu items (e.g. Pizzas, Pastas, Drinks).
                </p>
              </div>
              <Link href="/admin/menuCategories/new">
                <Button variant="mainButton" size="md" className="gap-1.5">
                  <Plus size={16} /> Add category
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
