"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import type { Doc } from "@/lib/types";
import { useResource } from "@/components/AdminShell";
import { ResourceForm } from "@/components/ResourceForm";
import { ErrorBox, PageHeader, Spinner } from "@/components/ui";

export default function EditPage({ params }: PageProps<"/content/[resource]/[id]">) {
  const { resource: key, id } = use(params);
  const resource = useResource(key);
  const [item, setItem] = useState<Doc | null | undefined>(id === "new" ? null : undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id === "new") return;
    api<{ item: Doc }>(`admin/content/${key}/${id}`).then((d) => setItem(d.item)).catch((e) => setError(e.message));
  }, [key, id]);

  if (!resource) return <ErrorBox message="You don't have access to this section." />;
  if (error) return <ErrorBox message={error} />;
  if (item === undefined) return <Spinner />;

  const title = item ? String(item[resource.titleField] ?? resource.singular) : `New ${resource.singular.toLowerCase()}`;
  return (
    <>
      <Link href={`/content/${key}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal-900">
        <ArrowLeft className="size-4" /> {resource.label}
      </Link>
      <PageHeader title={title} />
      <ResourceForm key={item?._id ?? "new"} resource={resource} initial={item} />
    </>
  );
}
