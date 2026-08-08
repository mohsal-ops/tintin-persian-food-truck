
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
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import ActivateAndDesactivate, {
  DeleteItemComp,
  IsFeaturedOrNot,
} from "./_components/productsActions";
import SampleMenuButtons from "./_components/SampleMenuButtons";

export default async function Items() {
  const items = await db.item?.findMany();
  const itemAndTypeFunction = async (items: any[]) => {
    return await Promise.all(
      items.map(async (item) => {
        const category = await db.types.findUnique({
          where: { id: item.typeId },
          select: { name: true },
        });

        return {
          ...item,
          typename: category?.name || "Unknown", // Handle case where category is not found
        };
      }),
    );
  };
  const data = await itemAndTypeFunction(items);

  return (
    <div className="lg:flex justify-center">
      <div className="p-5 space-y-3 w-full lg:w-[80%]">
        <div className="flex flex-wrap justify-between gap-3 items-center">
          <PageHeader>Menu Items</PageHeader>
          <div className="flex flex-wrap items-center gap-2">
            <SampleMenuButtons />
            <Link href="/admin/menuItems/new">
              <Button variant="outline" className="p-5 text-md">add item</Button>
            </Link>
          </div>
        </div>
        <div>
          <Table>
            <TableCaption>
              {data.length > 0 ? "A list of your items" : "No items found"}
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead className="">
                  <span className="">Status</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-0">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((obj) => (
                <TableRow key={obj?.id}>
                  <TableCell>
                    {obj?.isAvailableForPurchase ? (
                      <>
                        <span className="sr-only">Available</span>
                        <CheckCircle2 className="stroke-green-500" />
                      </>
                    ) : (
                      <>
                        <span className="sr-only">Unavailable</span>
                        <XCircle className="stroke-destructive" />
                      </>
                    )}
                  </TableCell>
                  <TableCell>{obj?.name}</TableCell>
                  <TableCell>
                    {formatCurrency(obj?.priceInCents / 100)}
                  </TableCell>
                  <TableCell>{obj?.typename}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span className="sr-only">Actions</span>
                        <MoreVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <IsFeaturedOrNot id={obj?.id} isProductFeatured={obj?.featured} />
                        <ActivateAndDesactivate
                          id={obj?.id}
                          isAvailableForPurchase={obj?.isAvailableForPurchase}
                        />
                        <DropdownMenuItem >
                          <Link href={`/admin/menuItems/${obj.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem >
                          <Link href={`/admin/menuItems/${obj.id}/sidesGroup`}>Add Sides</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteItemComp id={obj?.id} />
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
