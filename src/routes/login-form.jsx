import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import loginFormSchema from "../schema/login-form-schema";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const URL = "http://localhost:3000";

function LoginForm() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
    resolver: zodResolver(loginFormSchema),
    delayError: 300,
  });

  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      const res = await fetch(URL, {
        method: "POST",
        body: new URLSearchParams(data),
      });

      const json = await res.json();

      if (res.ok) {
        // add the cookies and redirect to the root rout
        console.log("login form: logged in");
        Cookies.set("userId", json.userId);
        navigate("/");
      } else {
        form.setError("root.serverError", {
          message: json.message,
        });
      }
    } catch (error) {
      form.setError("root.serverError", {
        message:
          "حدث خطأ ما، غير قادر على الوصول الى السيرفر اعد المحاولة لاحقا",
      });
    }
  }

  return (
    <div dir="rtl" className="container grid items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mx-auto w-full max-w-lg">
            <CardHeader>
              <CardTitle className="mb-2">تسجيل الدخول</CardTitle>
              <CardDescription>
                قم بتسجيل الدخول باستخدام معلومات حسابك من سيرياتل
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المستخدم</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder={"اسم المستخدم أو رقم الخليوي"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder={"كلمة المرور"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="space-y-4">
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full"
              >
                {form.formState.isSubmitting ? (
                  <LoaderCircle strokeWidth={2} className="animate-spin" />
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>

              <FormMessage>
                {form.formState.errors.root?.serverError &&
                  form.formState.errors.root?.serverError.message}
              </FormMessage>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
export default LoginForm;
