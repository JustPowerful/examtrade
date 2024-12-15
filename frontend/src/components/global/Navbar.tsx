import {
  Eye,
  LayoutDashboard,
  Loader2,
  LogOut,
  Search,
  User,
} from "lucide-react";
import examtradeLogo from "../../assets/logo.png";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "react-query";
import toast from "react-hot-toast";

import { useAuth } from "@/stores/authStore";

const LoginModal = () => {
  const [passVisible, setPassVisible] = useState(false);
  const initialFormState = {
    email: "",
    password: "",
  };
  const [form, setForm] = useState(initialFormState);
  const navigate = useNavigate();
  // async function handleLogin(event: React.MouseEvent<HTMLButtonElement>) {
  //   event.preventDefault();
  //   try {
  //     const response = await fetch(`/api/auth/login`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         email: form.email,
  //         password: form.password,
  //       }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     if (data) {
  //       toast(data.message);
  //       if (response.ok) {
  //         setForm(initialFormState);
  //         // set zustand state later
  //         navigate("/dashboard");
  //       }
  //     }
  //   } catch (error) {
  //     toast("An error occurred", {
  //       icon: "❌",
  //     });
  //   }
  // }
  const login = useAuth((state) => state.login);
  async function handleLogin() {
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (error) {
      toast("An error occurred", {
        icon: "❌",
      });
    }
  }
  const { refetch, isFetching } = useQuery("login", handleLogin, {
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Login</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>
          Log into your account to access all the features.
        </DialogDescription>
        <form>
          <div className="flex flex-col gap-4">
            <Label htmlFor="email">Email</Label>
            <Input
              value={form.email}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, email: event.target.value }));
              }}
              id="email"
              type="email"
              placeholder="Email"
            />

            <div className="relative">
              <Label htmlFor="email">Password</Label>

              <Input
                value={form.password}
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }));
                }}
                type={passVisible ? "text" : "password"}
                placeholder="Password"
              />
              <button
                onClick={() => {
                  setPassVisible((prev) => !prev);
                }}
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <Eye className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <Button
              onClick={(event) => {
                event.preventDefault();
                refetch();
              }}
            >
              {isFetching ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RegisterModal = () => {
  const initialFormState = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "student" as "student" | "professor",
  };
  const [form, setForm] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: "student" | "professor";
  }>(initialFormState);

  async function handleRegister() {
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          password: form.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data) {
        toast(data.message);
        if (response.ok) {
          setForm(initialFormState);
        }
      }
    } catch (error) {
      toast("An error occurred", {
        icon: "❌",
      });
    }
  }

  const { refetch, isLoading } = useQuery("register", handleRegister, {
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-white text-black hover:bg-zinc-200">
          Register
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Register</DialogTitle>
        <DialogDescription>
          Create an account to access all the features.
        </DialogDescription>
        <form>
          <div className="flex flex-col gap-4">
            <RadioGroup
              onValueChange={(value) => {
                setForm((prev) => ({
                  ...prev,
                  role: value as "student" | "professor",
                }));
              }}
              value={form.role}
              className="flex"
            >
              <Label>You are a </Label>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="r1" />
                <Label htmlFor="r1">Student</Label>
              </div>{" "}
              |
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professor" id="r2" />
                <Label htmlFor="r2">Professor</Label>
              </div>
            </RadioGroup>
            <Label htmlFor="firstname">Firstname</Label>
            <Input
              onChange={(event) =>
                setForm((prev) => ({ ...prev, firstname: event.target.value }))
              }
              value={form.firstname}
              id="firstname"
              type="text"
              placeholder="Firstname"
            />
            <Label htmlFor="lastname">Lastname</Label>
            <Input
              onChange={(event) =>
                setForm((prev) => ({ ...prev, lastname: event.target.value }))
              }
              value={form.lastname}
              id="lastname"
              type="text"
              placeholder="Lastname"
            />
            <Label htmlFor="email">Email</Label>
            <Input
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              value={form.email}
              id="email"
              type="email"
              placeholder="Email"
            />
            <Label htmlFor="password">Password</Label>
            <Input
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              value={form.password}
              type="password"
              placeholder="Password"
            />
            <Button
              onClick={(event) => {
                event.preventDefault();
                refetch();
              }}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const loading = useAuth((state) => state.loading);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button")
      ) {
        setToggleMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="box-border absolute top-0 left-0 w-full p-6 z-40">
      <div className="flex items-center justify-between bg-zinc-200 bg-opacity-25 backdrop-blur-lg py-2 px-6 rounded-md">
        <div>
          <img className="w-44" src={examtradeLogo} alt="logo of examtrade" />
        </div>
        {loading ? (
          <div>
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="flex gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setToggleMenu((prev) => !prev);
                  }}
                  className="p-3  rounded-full bg-slate-500 text-white flex items-center justify-center"
                >
                  <User className="w-4 h-4" />
                </button>

                {toggleMenu && (
                  <div
                    ref={menuRef}
                    className="absolute top-full mt-2 right-0 w-[200px] bg-white p-4 rounded-md shadow-md"
                  >
                    <div className="flex flex-col gap-2">
                      <Link
                        to="/browse"
                        className="text-zinc-800 flex items-center gap-1 justify-center p-2 rounded-md border-2 w-full hover:bg-zinc-200"
                      >
                        <Search className="w-4 h-4" /> Browse Exams
                      </Link>
                      <Link
                        to="/dashboard"
                        className="text-zinc-800 flex items-center gap-1 justify-center p-2 rounded-md border-2 w-full hover:bg-zinc-200"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    </div>
                    <hr className="mt-2" />
                    <Button
                      onClick={() => {
                        logout();
                      }}
                      className="mt-2 w-full flex items-center gap-1"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <LoginModal />
                <RegisterModal />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
