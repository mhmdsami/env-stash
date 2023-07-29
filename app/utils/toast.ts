import toast from "react-hot-toast";

const toastBaseOptions = {
  style: {
    background: "#161b22",
    color: "#fff",
    border: "1px solid #30363d",
  },
};

export default {
  show: (message: string, icon: string) =>
    toast.error(message, { ...toastBaseOptions, icon }),
  error: (message: string) => toast(message, toastBaseOptions),
  success: (message: string) => toast.success(message, toastBaseOptions),
};
