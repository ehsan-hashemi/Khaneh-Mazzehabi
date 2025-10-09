import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    orderTitle: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("لطفاً نام و نام خانوادگی را وارد کنید");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("لطفاً شماره تلفن را وارد کنید");
      return false;
    }
    if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      toast.error("شماره تلفن معتبر نیست");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("لطفاً توضیحات سفارش را وارد کنید");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create form data for Google Forms
      const googleFormData = new FormData();
      googleFormData.append("entry.1779351425", formData.name);
      googleFormData.append("entry.612053626", formData.phone);
      googleFormData.append("entry.420437738", formData.orderTitle);
      googleFormData.append("entry.946057571", formData.description);

      // Submit to Google Forms
      const response = await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLScOy0P6NRXcB6q8Ud-FlJVmTqcwbDidilgq282BEVxA4WAyXQ/formResponse",
        {
          method: "POST",
          body: googleFormData,
          mode: "no-cors", // Google Forms requires no-cors mode
        }
      );

      // Since no-cors doesn't return response, we assume success
      toast.success("اطلاعات شما ثبت شد و به زودی با شما تماس گرفته می‌شود");
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        orderTitle: "",
        description: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("خطا در ارسال فرم. لطفاً دوباره تلاش کنید");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container px-4 py-16">
      <Card className="mx-auto max-w-2xl shadow-card">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            ثبت سفارش
          </CardTitle>
          <p className="text-center text-muted-foreground">
            فرم زیر را پر کنید تا با شما تماس بگیریم
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                نام و نام خانوادگی <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="نام و نام خانوادگی خود را وارد کنید"
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                شماره تلفن <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="09123456789"
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderTitle">عنوان سفارش</Label>
              <Input
                id="orderTitle"
                name="orderTitle"
                value={formData.orderTitle}
                onChange={handleChange}
                placeholder="مثلاً: طراحی وب‌سایت"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                توضیحات سفارش <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="توضیحات کامل سفارش خود را بنویسید..."
                rows={5}
                required
                aria-required="true"
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "در حال ارسال..." : "ارسال سفارش"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default OrderForm;
