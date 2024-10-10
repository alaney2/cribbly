"use client";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/catalyst/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input, InputGroup } from "@/components/catalyst/input";
import { Field, Label } from "@/components/catalyst/fieldset";
import { Heading } from "@/components/catalyst/heading";
import { Strong, Text, TextLink } from "@/components/catalyst/text";
import * as Headless from "@headlessui/react";
import { Switch } from "@/components/catalyst/switch";
import { EditFeeDialog } from "@/components/dialogs/EditFeeDialog";
import { addPropertyFees, addFee, getLease } from "@/utils/supabase/actions";
import { format, addYears, subDays, addDays, addWeeks } from "date-fns";
import { BillingScheduleDialog } from "@/components/dialogs/BillingScheduleDialog";
import { AddFeeDialog } from "@/components/dialogs/AddFeeDialog";
import { toast } from "sonner";
import { daysBetween } from "@/utils/helpers";
import { parseISO } from "date-fns";
import { Divider } from "@/components/catalyst/divider";
import { motion, AnimatePresence } from "framer-motion";
import { BankSelect } from "@/components/PropertySettings/BankSelect";
import useSWR, { mutate } from "swr";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/catalyst/skeleton";

export function BankCard() {
	return (
		<Card>
			<CardHeader>
				<Heading>Bank Account</Heading>
				<Text className="">
					Connect your bank account to receive payments from tenants. You can
					set different bank accounts for each property.
				</Text>
			</CardHeader>
			<CardContent>
				<Headless.Field className="relative flex flex-col md:flex-row md:items-center md:gap-4">
					<Label
						htmlFor="rentAmount"
						className="mb-2 md:mb-0 md:w-40 md:flex-shrink-0"
					>
						Bank account
					</Label>
					<BankSelect />
				</Headless.Field>
			</CardContent>
		</Card>
	);
}
