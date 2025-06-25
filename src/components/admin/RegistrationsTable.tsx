
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { Registration, categories } from "@/types/admin";

interface RegistrationsTableProps {
  registrations: Registration[];
  selectedRegistrations: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRegistration: (id: string, checked: boolean) => void;
  onApproval: (id: string, action: 'approve' | 'reject') => void;
  onEdit: (registration: Registration) => void;
  onDelete: (id: string) => void;
  onChangeCategory: (registration: Registration) => void;
}

const RegistrationsTable = ({
  registrations,
  selectedRegistrations,
  onSelectAll,
  onSelectRegistration,
  onApproval,
  onEdit,
  onDelete,
  onChangeCategory
}: RegistrationsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={selectedRegistrations.length === registrations.length && registrations.length > 0}
              onCheckedChange={onSelectAll}
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
              No registrations found matching your criteria.
            </TableCell>
          </TableRow>
        ) : (
          registrations.map((registration) => (
            <TableRow key={registration.id}>
              <TableCell>
                <Checkbox
                  checked={selectedRegistrations.includes(registration.id)}
                  onCheckedChange={(checked) => onSelectRegistration(registration.id, !!checked)}
                />
              </TableCell>
              <TableCell className="font-medium">{registration.fullName}</TableCell>
              <TableCell>{registration.mobileNumber}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-[#ffc508]">
                  {categories.find(c => c.value === registration.category)?.label}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    registration.status === 'approved' ? 'default' : 
                    registration.status === 'rejected' ? 'destructive' : 'secondary'
                  } 
                  className="bg-[#08b708]"
                >
                  {registration.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(registration.submittedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(registration)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onChangeCategory(registration)}
                  >
                    Change
                  </Button>
                  {registration.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => onApproval(registration.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => onApproval(registration.id, 'reject')}
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {registration.fullName}'s registration? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDelete(registration.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default RegistrationsTable;
