import { useDispatch } from "react-redux";
import { updateInfo } from "@/redux/userSlice";
import { useRouter } from "next/router";
import OnboardingForm from "@/components/OnboardingForm";
export default function BuyerOnboarding() {
  const dispatch = useDispatch();
  const router = useRouter();
  const fields = [
    { name: "funds", label: "Funds Available (e.g., $5-10M)", required: true },
    {
      name: "industries",
      label: "Preferred Industries (comma-separated)",
      required: true,
    },
    {
      name: "dealSize",
      label: "Deal Size Range (e.g., $5-20M)",
      required: true,
    },
    {
      name: "locations",
      label: "Location Preferences (comma-separated)",
      required: true,
    },
    {
      name: "experience",
      label: "Acquisition Experience",
      required: false,
      type: "textarea",
    },
  ];
  const onSubmit = (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target).entries());
    dispatch(updateInfo(form));
    router.push("/matches");
  };
  return (
    <OnboardingForm
      title="Buyer Onboarding"
      fields={fields}
      onSubmit={onSubmit}
    />
  );
}
