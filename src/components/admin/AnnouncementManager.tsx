import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Announcement } from "@/types/admin";

interface AnnouncementManagerProps {
  announcements: Announcement[];
  onUpdate: (announcements: Announcement[]) => void;
}

const AnnouncementManager = ({ announcements, onUpdate }: AnnouncementManagerProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    link: "",
    isActive: true,
    category: ""
  });

  const handleAdd = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: "",
      content: "",
      link: "",
      isActive: true,
      category: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      link: announcement.link || "",
      isActive: announcement.isActive,
      category: announcement.category || ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    let updatedAnnouncements;
    if (editingAnnouncement) {
      updatedAnnouncements = announcements.map(a => 
        a.id === editingAnnouncement.id 
          ? { ...editingAnnouncement, ...formData }
          : a
      );
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      updatedAnnouncements = [newAnnouncement, ...announcements];
    }

    onUpdate(updatedAnnouncements);
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: `Announcement ${editingAnnouncement ? 'updated' : 'added'} successfully`
    });
  };

  const handleDelete = (id: string) => {
    const updatedAnnouncements = announcements.filter(a => a.id !== id);
    onUpdate(updatedAnnouncements);
    toast({
      title: "Success",
      description: "Announcement deleted successfully"
    });
  };

  const toggleStatus = (id: string) => {
    const updatedAnnouncements = announcements.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    );
    onUpdate(updatedAnnouncements);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Announcement Management
            </CardTitle>
            <CardDescription>Create and manage program announcements</CardDescription>
          </div>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-1" />
            Add Announcement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell className="font-medium">{announcement.title}</TableCell>
                <TableCell className="max-w-xs truncate">{announcement.content}</TableCell>
                <TableCell>
                  {announcement.category && (
                    <Badge variant="outline">{announcement.category}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={announcement.isActive ? "default" : "secondary"}>
                    {announcement.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(announcement.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(announcement.id)}
                    >
                      {announcement.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(announcement)}
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
                            Are you sure you want to delete "{announcement.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(announcement.id)}
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
              </DialogTitle>
              <DialogDescription>
                Create announcements to keep users informed about program updates
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Announcement title"
                />
              </div>
              <div className="space-y-2">
                <Label>Content *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Announcement content"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Link (Optional)</Label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Category (Optional)</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., General, Pennyekart, E-Life"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label>Active</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingAnnouncement ? 'Update' : 'Add'} Announcement
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

export default AnnouncementManager;