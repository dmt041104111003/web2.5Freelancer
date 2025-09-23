"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";

type RoleType = "freelancer" | "poster";

interface RoleModalContextValue {
  open: (preselect?: RoleType | null) => void;
  close: () => void;
}

const RoleModalContext = createContext<RoleModalContextValue | null>(null);

export function useRoleModal() {
  const ctx = useContext(RoleModalContext);
  if (!ctx) throw new Error("useRoleModal must be used within RoleModalProvider");
  return ctx;
}

export function RoleModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  const open = (preselect?: RoleType | null) => {
    setSelectedRole(preselect ?? null);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  const confirm = () => {
    if (!selectedRole) return;
    // Placeholder for real registration logic
    // You can export selectedRole through another context or callback if needed
    setIsOpen(false);
  };

  return (
    <RoleModalContext.Provider value={{ open, close }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={close}>
          <div className="bg-background border border-border rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Đăng ký vai trò</h3>
            <p className="text-sm text-muted-foreground mb-4">Chọn một vai trò để tiếp tục đăng ký.</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                variant={selectedRole === "freelancer" ? "primary" : "outline"}
                onClick={() => setSelectedRole("freelancer")}
              >
                Freelancer
              </Button>
              <Button
                variant={selectedRole === "poster" ? "primary" : "outline"}
                onClick={() => setSelectedRole("poster")}
              >
                Người thuê việc
              </Button>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={close}>Hủy</Button>
              <Button variant="primary" size="sm" onClick={confirm} disabled={!selectedRole}>Xác nhận</Button>
            </div>
          </div>
        </div>
      )}
    </RoleModalContext.Provider>
  );
}


