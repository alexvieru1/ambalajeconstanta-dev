import { getProduseMenu } from "@/lib/shopify";
import Image from "next/image";
import Link from "next/link";

export default async function ProdusePage() {
  // ✅ Fetch only the produse menu
  const menu = await getProduseMenu();

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Categorii de produse</h1>

      {menu.length === 0 ? (
        <p>Nu am găsit categorii de produse.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="group block border rounded-md overflow-hidden hover:shadow-lg transition"
            >
              {item.image?.url ? (
                // ✅ If image exists, show image
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={item.image.url}
                    alt={item.image.altText || item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              ) : (
                // ✅ Fallback: placeholder if no image
                <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  Imagine categorie
                </div>
              )}

              <div className="p-3 text-center">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
