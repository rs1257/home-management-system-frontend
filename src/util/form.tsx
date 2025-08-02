import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import BaseField from "@/components/form/BaseField";
import { SubmitButton } from "@/components/form/SubmitButton";

const { fieldContext, formContext } = createFormHookContexts();
export const { useAppForm } = createFormHook({
	fieldComponents: {
		BaseField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});
