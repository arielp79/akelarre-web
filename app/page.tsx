"use client";
import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function HomeScanner() {
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    const onScanSuccess = (result: string) => {
      // Intentamos limpiar el scanner antes de redirigir
      scanner.clear().then(() => {
        // Si el QR trae la URL completa, extraemos solo la ruta
        // Si ya trae solo el slug (ej: /lcb), el replace no hará nada
        const path = result.replace(window.location.origin, "");
        router.push(path);
      }).catch(err => {
        console.error("Error al limpiar el scanner tras éxito:", err);
      });
    };

    const onScanError = (error: any) => {
      // Error silencioso mientras busca el QR
    };

    scanner.render(onScanSuccess, onScanError);

    // El destructor debe ser una función sincrónica
    return () => {
      // Verificamos si el elemento 'reader' todavía existe antes de limpiar
      const readerElement = document.getElementById("reader");
      if (readerElement) {
        scanner.clear().catch(err => console.error("Error al limpiar el scanner al desmontar:", err));
      }
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-black italic tracking-tighter mb-2">AKELARRE</h1>
        <p className="text-zinc-400 uppercase tracking-widest text-xs font-bold">Escaneá el código de tu mesa</p>
      </header>

      {/* El contenedor donde se renderiza la cámara */}
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div id="reader" className="w-full"></div>
      </div>

      <footer className="mt-10 text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
        Sistema de préstamos v1.0
      </footer>

      {/* Estilos mínimos para que el scanner no rompa tu estética Dark */}
      <style jsx global>{`
        #reader { border: none !important; }
        #reader__scan_region { background: #09090b !important; }
        #reader__dashboard_section_csr button { 
          background: #4f46e5 !important; 
          color: white !important; 
          border-radius: 12px !important;
          padding: 8px 16px !important;
          border: none !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          font-size: 12px !important;
        }
      `}</style>
    </main>
  );
}