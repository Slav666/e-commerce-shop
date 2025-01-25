import PageHeader from "../_components/PageHeader";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  // TableCell,
} from "../../../components/ui/table";

import Link from "next/link";

const AdminProductPage = () => {
  return (
    <div className="flex justify-between item-center gap-4">
      <PageHeader>Product</PageHeader>
      <Button asChild>
        <Link href="products/new">Add Product</Link>
      </Button>
      <ProductTable />
    </div>
  );
};

export default AdminProductPage;

export async function ProductTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody></TableBody>
    </Table>
  );
}
