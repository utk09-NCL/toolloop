"use client";
import { useActionState, useState } from "react";
import { createTool } from "@/actions/tools";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CATEGORY_LABELS, CONDITION_LABELS, NEIGHBORHOODS } from "@/lib/constants";
import styles from "./new.module.css";

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const CONDITION_OPTIONS = Object.entries(CONDITION_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const NEIGHBORHOOD_OPTIONS = NEIGHBORHOODS.map((n) => ({ value: n, label: n }));

export function NewToolForm({ defaultNeighborhood }: { defaultNeighborhood: string }) {
  const [state, formAction, isPending] = useActionState(createTool, null);
  const [isDirty, setIsDirty] = useState(false);
  // Hide errors as soon as the user edits any field; reveal again on next submit attempt
  const errors = state?.ok === false && !isDirty ? state.errors : {};

  return (
    <form
      action={formAction}
      className={styles.form}
      noValidate
      onChange={() => setIsDirty(true)}
      onSubmit={() => setIsDirty(false)}
    >
      <Input
        label="Tool name"
        name="name"
        placeholder="e.g. Cordless Drill (18V)"
        required
        error={errors.name}
        autoFocus
      />

      <div className={styles.row}>
        <Select
          label="Category"
          name="category"
          options={[{ value: "", label: "Select category…" }, ...CATEGORY_OPTIONS]}
          error={errors.category}
        />
        <Select
          label="Condition"
          name="condition"
          options={[{ value: "", label: "Select condition…" }, ...CONDITION_OPTIONS]}
          error={errors.condition}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className={[styles.textarea, errors.description ? styles.textareaError : ""].join(" ")}
          placeholder="Brief description - what it is, what it's good for."
          rows={3}
          maxLength={600}
          aria-describedby={errors.description ? "description-error" : undefined}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <span id="description-error" className={styles.fieldError} role="alert">
            {errors.description}
          </span>
        )}
      </div>

      <Select
        label="Neighborhood"
        name="neighborhood"
        defaultValue={defaultNeighborhood}
        options={[{ value: "", label: "Select neighborhood…" }, ...NEIGHBORHOOD_OPTIONS]}
        error={errors.neighborhood}
      />

      <div className={styles.field}>
        <label htmlFor="rules" className={styles.label}>
          Rules for borrowing <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="rules"
          name="rules"
          className={styles.textarea}
          placeholder="e.g. Return clean. Pickup evenings only."
          rows={2}
          maxLength={300}
        />
      </div>

      {state?.ok === false && !Object.keys(errors).length && (
        <p className={styles.formError} role="alert">
          Something went wrong. Please try again.
        </p>
      )}

      <div className={styles.submit}>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Listing…" : "List this tool"}
        </Button>
      </div>
    </form>
  );
}
