import SimpleNavbar from "@/components/SimpleNavbar";

export default function PrivacidadPage() {
    return (
        <main className="min-h-screen bg-white text-das-dark font-raleway">
            <SimpleNavbar />
            <div className="max-w-4xl mx-auto py-32 px-6">
                <h1 className="font-poppins font-bold text-4xl mb-12">Política de Privacidad</h1>

                <div className="prose prose-sm md:prose-base max-w-none text-gray-600">
                    <h2 className="font-poppins font-bold text-xl text-das-dark mt-8 mb-4">1. Responsable del Tratamiento</h2>
                    <ul className="list-disc pl-5 mb-6 space-y-2">
                        <li><strong>Identidad:</strong> Digital Atelier Solutions LLC.</li>
                        <li><strong>Domicilio:</strong> North Gould Street, Sheridan, WY 82801, USA.</li>
                        <li><strong>Contacto de Privacidad:</strong> info@digitalateliersolutions.agency</li>
                    </ul>

                    <h2 className="font-poppins font-bold text-xl text-das-dark mt-8 mb-4">2. Finalidad y Legitimación</h2>
                    <p className="mb-2">Tratamos la información que nos facilitas para:</p>
                    <ol className="list-decimal pl-5 mb-4 space-y-2">
                        <li><strong>Prestación de Servicios:</strong> Gestionar la relación contractual y los servicios de agencia o suscripción a Blockcha-in.</li>
                        <li><strong>Agendamiento:</strong> Gestionar las citas solicitadas a través de nuestra integración con Cal.com.</li>
                        <li><strong>Comunicaciones:</strong> Si te has suscrito, enviarte nuestra newsletter o análisis de mercado.</li>
                    </ol>
                    <p className="mb-4">
                        La base legal es tu <strong>consentimiento</strong> (al reservar/suscribirte) y la <strong>ejecución de un contrato</strong> (al contratar servicios).
                    </p>

                    <h2 className="font-poppins font-bold text-xl text-das-dark mt-8 mb-4">3. Transferencia Internacional de Datos</h2>
                    <p className="mb-4">
                        Te informamos que, debido a la ubicación de nuestra sede legal (EE.UU.) y nuestros proveedores tecnológicos, tus datos pueden ser procesados fuera del Espacio Económico Europeo (EEE).
                    </p>
                    <p className="mb-4">
                        Digital Atelier Solutions LLC se compromete a tratar tus datos con las garantías de seguridad adecuadas, utilizando proveedores de primer nivel (como Cloudflare, Cal.com, Google) adheridos al Data Privacy Framework (DPF) UE-EE.UU. o mediante Cláusulas Contractuales Tipo, garantizando la seguridad de tu información.
                    </p>

                    <h2 className="font-poppins font-bold text-xl text-das-dark mt-8 mb-4">4. Destinatarios</h2>
                    <p className="mb-2">No vendemos tus datos. Solo los compartimos con proveedores estrictamente necesarios para la operativa web:</p>
                    <ul className="list-disc pl-5 mb-6 space-y-2">
                        <li><strong>Hosting & CDN:</strong> Cloudflare Inc. (EE.UU.)</li>
                        <li><strong>Agenda:</strong> Cal.com Inc. (EE.UU.)</li>
                        <li><strong>Analítica:</strong> Vercel / Google Analytics.</li>
                    </ul>

                    <h2 className="font-poppins font-bold text-xl text-das-dark mt-8 mb-4">5. Tus Derechos</h2>
                    <p className="mb-4">
                        Respetamos tus derechos de privacidad globales. Puedes solicitar el acceso, rectificación, supresión y portabilidad de tus datos escribiendo directamente a info@digitalateliersolutions.agency.
                    </p>
                </div>
            </div>
        </main>
    );
}
