import { getPostById } from "@/app/admin/actions";
import AdminPostEditor from "./components/AdminPostEditor";
import { notFound } from "next/navigation";

export default async function AdminPostPage({ params }: { params: { id: string } }) {
    const { data: post, error } = await getPostById(params.id);

    if (error || !post) {
        notFound();
    }

    return <AdminPostEditor post={post} />;
}
