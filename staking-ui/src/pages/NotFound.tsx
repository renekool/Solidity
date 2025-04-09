import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Box } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="backdrop-blur-sm bg-white/90 border border-primary/20 shadow-xl rounded-3xl p-8 space-y-8 text-center">
          <div className="relative h-24 flex items-center justify-center">
            <div className="absolute w-24 h-24 rounded-full bg-primary opacity-10" />
            <Box 
              className="w-16 h-16 text-primary z-10" 
              strokeWidth={1.5}
            />
          </div>
          
          <div className="space-y-4">
            <div className="text-4xl sm:text-5xl md:text-7xl font-bold text-primary">404</div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Normalmente somos un cofre lleno de tesoros de conocimiento, 
              pero no pudimos encontrar lo que estás buscando.
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              La ruta {location.pathname} se ha perdido en el mar de bytes
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={() => window.location.href = '/'}
              className="h-10 px-6 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 group"
            >
              <Home className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              ¡Regresa a la Aventura!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;