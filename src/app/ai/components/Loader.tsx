import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center py-10"
    >
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </motion.div>
  );
};

export default Loader;