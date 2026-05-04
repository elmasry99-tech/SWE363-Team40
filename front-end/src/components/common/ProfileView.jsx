"use client";

import { useState } from "react";
import { AppScaffold } from "@/components/common/AppScaffold";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useSessionState } from "@/hooks/useSessionState";

export function ProfileView({ pathname }) {
  const { state, request, signOut } = useSessionState();
  const role = state.role || "internal";
  const user = state.user || {};
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleDeleteAccount() {
    try {
      setDeleting(true);
      setDeleteError("");
      await request("/users/me", { method: "DELETE" });
      signOut();
    } catch (error) {
      setDeleteError(error.message);
      setDeleting(false);
    }
  }

  return (
    <AppScaffold
      role={role}
      title="Profile"
      subtitle="Account overview and role identity"
      pathname={pathname}
      onLogout={signOut}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-base font-medium text-[var(--text-main)]">Account Details</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
            <p><span className="font-medium text-[var(--text-main)]">Name:</span> {user.name || "Unknown"}</p>
            <p><span className="font-medium text-[var(--text-main)]">Email:</span> {user.email || "Unknown"}</p>
            <p><span className="font-medium text-[var(--text-main)]">Role:</span> {role}</p>
            <p><span className="font-medium text-[var(--text-main)]">Organization ID:</span> {user.orgId || "None"}</p>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-base font-medium text-[var(--text-main)]">Security Summary</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--text-soft)]">
            <p>JWT-backed session active</p>
            <p>Role-based workspace controls applied</p>
            <p>Steganography key pair is generated on first authenticated use</p>
          </div>
        </Card>
      </div>

      <Card className="mt-6 border-red-200 p-6">
        <p className="text-base font-medium text-red-600">Danger Zone</p>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        {deleteError ? <p className="mt-2 text-sm text-red-500">{deleteError}</p> : null}
        {confirmDelete ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-red-600">Are you sure? This is irreversible.</p>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)} disabled={deleting}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="danger"
            className="mt-4"
            onClick={() => setConfirmDelete(true)}
          >
            Delete Account
          </Button>
        )}
      </Card>
    </AppScaffold>
  );
}
