import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Panchayath } from "@/types/admin";

interface PanchayathManagerProps {
  panchayaths: Panchayath[];
  onUpdate: (panchayaths: Panchayath[]) => void;
}

const PanchayathManager = ({ panchayaths, onUpdate }: PanchayathManagerProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPanchayath, setEditingPanchayath] = useState<Panchayath | null>(null);
  const [formData, setFormData] = useState({
    malayalamName: "",
    englishName: "",
    pincode: "",
    district: "Malappuram"
  });

  const handleAdd = () => {
    setEditingPanchayath(null);
    setFormData({
      malayalamName: "",
      englishName: "",
      pincode: "",
      district: "Malappuram"
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (panchayath: Panchayath) => {
    setEditingPanchayath(panchayath);
    setFormData({
      malayalamName: panchayath.malayalamName,
      englishName: panchayath.englishName,
      pincode: panchayath.pincode,
      district: panchayath.district
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.malayalamName.trim() || !formData.englishName.trim()) {
      toast({
        title: "Error",
        description: "Malayalam and English names are required",
        variant: "destructive"
      });
      return;
    }

    let updatedPanchayaths;
    if (editingPanchayath) {
      updatedPanchayaths = panchayaths.map(p => 
        p.id === editingPanchayath.id 
          ? { ...editingPanchayath, ...formData }
          : p
      );
    } else {
      const newPanchayath: Panchayath = {
        id: Date.now().toString(),
        ...formData
      };
      updatedPanchayaths = [...panchayaths, newPanchayath];
    }

    onUpdate(updatedPanchayaths);
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: `Panchayath ${editingPanchayath ? 'updated' : 'added'} successfully`
    });
  };

  const handleDelete = (id: string) => {
    const updatedPanchayaths = panchayaths.filter(p => p.id !== id);
    onUpdate(updatedPanchayaths);
    toast({
      title: "Success",
      description: "Panchayath deleted successfully"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Panchayath Management
            </CardTitle>
            <CardDescription>Manage the list of panchayaths available for registration</CardDescription>
          </div>
          <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-1" />
            Add Panchayath
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Malayalam Name</TableHead>
              <TableHead>English Name</TableHead>
              <TableHead>Pincode</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {panchayaths.map((panchayath) => (
              <TableRow key={panchayath.id}>
                <TableCell className="font-medium">{panchayath.malayalamName}</TableCell>
                <TableCell>{panchayath.englishName}</TableCell>
                <TableCell>{panchayath.pincode}</TableCell>
                <TableCell>{panchayath.district}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(panchayath)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
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
                            Are you sure you want to delete {panchayath.malayalamName}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(panchayath.id)}
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
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPanchayath ? 'Edit Panchayath' : 'Add New Panchayath'}
              </DialogTitle>
              <DialogDescription>
                Enter the panchayath details below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Malayalam Name *</Label>
                <Input
                  value={formData.malayalamName}
                  onChange={(e) => setFormData({ ...formData, malayalamName: e.target.value })}
                  placeholder="പഞ്ചായത്ത് നാമം"
                />
              </div>
              <div className="space-y-2">
                <Label>English Name *</Label>
                <Input
                  value={formData.englishName}
                  onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                  placeholder="Panchayath Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="676xxx"
                />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="District Name"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingPanchayath ? 'Update' : 'Add'} Panchayath
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PanchayathManager;