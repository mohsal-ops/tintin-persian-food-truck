import { Button } from "@/components/ui/button";
import PageHeader from "../_components/pageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DeleteItemComp,
  DeleteItemComp2,
} from "../menuItems/_components/productsActions";
import db from "@/db/db";
import Image from "next/image";

export default async function Items() {
  const categories = await db.types.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { items: true } },
    },
  });


      // <div className="lg:flex justify-center">
      // <div className="p-5 space-y-3 w-full lg:w-[80%]"></div>

  return (
    <div className="lg:flex justify-center">
      <div className="p-5 space-y-3  lg:w-[80%] ">
      <div className="flex justify-between w-full ">
        <PageHeader>Menu Categories</PageHeader>
        <Link href="/admin/menuCategories/new">
          <Button variant="outline">add category</Button>
        </Link>
      </div>
      <div>
        <Table>
          <TableCaption>
            {categories.length > 0
              ? "A list of Categories"
              : "No categories found"}
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cate) => (
              <TableRow key={cate?.id}>
                <TableCell>{cate?.name}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <span className="sr-only">Actions</span>
                      <MoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DeleteItemComp2
                        id={cate?.id}
                        disabled={cate._count.items > 0}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        </div>
    </div>
  );
}
