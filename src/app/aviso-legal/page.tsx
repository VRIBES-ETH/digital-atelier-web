import SimpleNavbar from "@/components/SimpleNavbar";

export default function AvisoLegalPage() {
    return (
        <main className="min-h-screen bg-white text-das-dark font-raleway">
            <SimpleNavbar />
            <div className="max-w-4xl mx-auto py-32 px-6">
                <h1 className="font-poppins font-bold text-4xl mb-12">Aviso Legal</h1>

                <div className="prose prose-sm md:prose-base max-w-none text-gray-600">
                    <h2 className="font-poppins font-bold text-xl text-das-dark mt-8 mb-4">1. Datos Identificativos</h2>
                    <p className="mb-4">
                        En cumplimiento con el deber de información y transparencia para sitios web corporativos, se exponen los datos del titular del sitio web:
                    </p>
                    <ul className="list-disc pl-5 mb-6 space-y-2">
                        <li><strong>Razón Social:</strong> Digital Atelier Solutions LLC (en adelante, &quot;la Compañía&quot;).</li>
                        <li><strong>Jurisdicción:</strong> Sociedad de Responsabilidad Limitada (LLC) registrada en el Estado de Wyoming, Estados Unidos.</li>
                        <li><strong>Employer Identification Number (EIN):</strong> 38-4325753</li>
                        <li><strong>Domicilio Social:</strong> North Gould Street, Sheridan, WY 82801, USA.</li>
                        <li><strong>Email de contacto:</strong> info@digitalateliersolutions.agency</li>
                        <li><strong>Marcas:</strong> &quot;Digital Atelier Solutions&quot; (DAS) y &quot;Blockcha-in&quot; son marcas comerciales y productos operados por la Compañía.</li>
                    </ul>

                    <h2 className="font-poppins font-bold text-xl text-das-dark mt-8 mb-4">2. Objeto</h2>
                    <p className="mb-4">
                        El sitio web www.digitalateliersolutions.agency ofrece servicios de consultoría de comunicación estratégica, copywriting y productos de información (&quot;Blockcha-in&quot;). El acceso a este sitio implica la aceptación de los presentes términos.
                    </p>

                    <h2 className="font-poppins font-bold text-xl text-das-dark mt-8 mb-4">3. Propiedad Intelectual</h2>
                    <p className="mb-4">
                        Todos los contenidos (textos, marcas, logos, whitepapers, podcasts) son propiedad exclusiva de Digital Atelier Solutions LLC o de terceros que han autorizado su uso. Queda prohibida su reproducción total o parcial sin consentimiento expreso.
                    </p>

                    <h2 className="font-poppins font-bold text-xl text-das-dark mt-8 mb-4">4. Limitación de Responsabilidad</h2>
                    <p className="mb-4">
                        La Compañía no se hace responsable de las decisiones de inversión o negocio tomadas basándose en la información general publicada en este sitio web o en el podcast Blockcha-in. Nuestros contenidos tienen finalidad informativa y educativa, no constituyendo asesoramiento financiero ni legal.
                    </p>

                    <h2 className="font-poppins font-bold text-xl text-das-dark mt-8 mb-4">5. Legislación Aplicable y Jurisdicción</h2>
                    <p className="mb-4">
                        Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web, será de aplicación la legislación del Estado de Wyoming (EE.UU.), sometiéndose las partes a los Juzgados y Tribunales competentes de dicha jurisdicción, salvo que la normativa de protección de consumidores aplicable disponga imperativamente lo contrario.
                    </p>
                </div>
            </div>
        </main>
    );
}
