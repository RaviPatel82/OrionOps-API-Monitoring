import React from 'react';
import { Search, X, RefreshCw, UserMinus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getRoleBadge } from '../utils.jsx';

export default function MemberList({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  filteredUsers,
  fetchingUsers,
  fetchUsers,
  activeClientId,
  setDeleteTarget
}) {
  return (
    <div className="space-y-4">
      {/* Search & Filter Command Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9 bg-transparent border-border focus-visible:ring-primary h-9 text-xs rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                <X size={12} />
              </button>
            )}
          </div>
          <Button className="h-9 px-4 text-[10px] uppercase font-bold tracking-tight rounded-md cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
            Find Member
          </Button>
        </div>
        <div className="flex items-center gap-2 bg-secondary/10 border border-border/50 rounded-md p-1 h-9">
          <button
            onClick={() => setRoleFilter('all')}
            className={cn(
              "px-3 h-full rounded-[2px] text-[9px] font-mono font-bold uppercase transition-all cursor-pointer",
              roleFilter === 'all' ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >All</button>
          <button
            onClick={() => setRoleFilter('client_admin')}
            className={cn(
              "px-3 h-full rounded-[2px] text-[9px] font-mono font-bold uppercase transition-all cursor-pointer",
              roleFilter === 'client_admin' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >Admins</button>
          <button
            onClick={() => setRoleFilter('client_viewer')}
            className={cn(
              "px-3 h-full rounded-[2px] text-[9px] font-mono font-bold uppercase transition-all cursor-pointer",
              roleFilter === 'client_viewer' ? "bg-tech-emerald/80 text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >Viewers</button>
        </div>
      </div>

      <div className="relative bento-item overflow-hidden bg-card/40 border border-border/50">
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-secondary/10">
          <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-foreground">
            Member Roster
            {searchTerm && <span className="ml-2 text-muted-foreground font-medium lowercase italic"> — found {filteredUsers.length} matches</span>}
          </h3>
          <div className="flex items-center gap-2">
            <Badge className="bg-accent text-foreground border-none rounded-md font-bold text-[9px] px-2 py-0.5">{filteredUsers.length} Result{filteredUsers.length !== 1 ? 's' : ''}</Badge>
            <Button variant="ghost" size="icon" className={cn("h-6 w-6 text-muted-foreground hover:text-primary cursor-pointer", fetchingUsers && "animate-spin")} onClick={() => fetchUsers(activeClientId)}>
              <RefreshCw size={12} />
            </Button>
          </div>
        </div>
        <div className="px-4 pb-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="h-8 text-left font-bold text-[8px] uppercase tracking-widest text-muted-foreground">Member</th>
                <th className="h-8 text-left font-bold text-[8px] uppercase tracking-widest text-muted-foreground px-4">Email</th>
                <th className="h-8 text-left font-bold text-[8px] uppercase tracking-widest text-muted-foreground px-4">Role</th>
                <th className="h-8 text-right font-bold text-[8px] uppercase tracking-widest text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map(user => (
                <tr key={user._id || user.id} className="group hover:bg-accent/20 transition-colors duration-150">
                  <td className="py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-md border border-border bg-card flex items-center justify-center text-foreground font-bold text-[9px] uppercase group-hover:border-primary transition-colors">
                        {user.username.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-[12px] text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-[10px] text-muted-foreground font-mono">{user.email}</span>
                  </td>
                  <td className="py-2 px-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="py-2 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-tech-rose hover:bg-tech-rose/10 cursor-pointer transition-all"
                      onClick={() => setDeleteTarget(user)}
                      title="Remove Member"
                      aria-label="Remove Member"
                    >
                      <UserMinus size={13} />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && !fetchingUsers && (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Search size={32} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">No members match your criteria</p>
                      {searchTerm && <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')} className="text-[9px] font-bold uppercase mt-2 h-7 underline decoration-primary underline-offset-4 cursor-pointer">Clear Search</Button>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
