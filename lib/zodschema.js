import media from '@/components/application/Admin/Media';
import {z} from 'zod';

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).+$/;
  
export const zschema=z.object({
    email: z.string().email({ message: "Invalid email address." }),
  password: z.string()
    .min(10, { message: "Password must be at least 10 characters long." })
    .max(128, { message: "Password must be at most 128 characters long." })
    .regex(strongPasswordRegex, {
      message:
        "Password must include uppercase, lowercase, number and special character.",
    }),
     name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name cannot exceed 50 characters")
      .trim(),

      otp :  z
  .string()
  .trim()
  .regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" }),
  _id:z.string().min(3,'_id is required'),
  alt :z.string().min(3,'alt is required'),
  title:z.string().min(3,'title is required'),
  slug:z.string().min(3,'slug is required'),
  category:z.string().min(3,'category is required'),
  mrp:z.union([
    z.number().positive('Expected a positive number'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number'),
  ]),
   sellingPrice:z.union([
    z.number().positive('Expected a positive number'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number'),
  ]),
   discountPercentage:z.union([
    z.number().positive('Expected a positive number'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number'),
  ]),
  description:z.string().min(3,'description is required'),
  media:z.array(z.string()),
  product:z.string().min(3,'Product is required'),
color:z.string().min(3,'Color is required'),
  size:z.string().min(1,'Size is required'),
  sku:z.string().min(3,'SKU is required'),
  code:z.string().min(3,'Code is required'),
  minShoppingAmount:z.union([
    z.number().positive('Expected a positive number'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number'),
  ]),
  amount:z.union([
    z.number().positive('Expected a positive number'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number'),
  ]),
  validity:z.coerce.date(),
   userId:z.string().min(3,'User id is required'),
rating:z.union([
    z.number().positive('Expected a positive number'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number'),
  ]),
  review:z.string().min(3,'Review is required'),
  code:z.string().min(3,'Coupon Code is required'),
  phone:z.string().min(10,'Phone number is required'),
  country:z.string().min(3,'Country is required'),
  state:z.string().min(3,'State is required'),
  city:z.string().min(3,'City is required'),
  pincode:z.string().min(3,'Pincode is required'),
  landmark:z.string().min(3,'Landmark is required'),
  ordernote:z.string().optional(),
 address:z.string().min(3,'Address is required'),

});
