import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { getAuthenticatedProfile, getTestSessionEmail, supabase, TEST_ACCOUNTS } from "@/lib/supabase";

export default function HomeRedirect() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkRole() {
      try {
        const testEmail = await getTestSessionEmail();
        if (testEmail && TEST_ACCOUNTS[testEmail]) {
          const account = TEST_ACCOUNTS[testEmail];
          if (account.role === "society_admin") {
            if (isMounted) setTarget("/society-admin/dashboard");
            return;
          }
          if (isMounted) setTarget("/(tabs)/explore");
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          if (isMounted) setTarget("/login");
          return;
        }

        const { profile } = await getAuthenticatedProfile(session.user.id);
        if (profile?.role === "society_admin") {
          if (isMounted) setTarget("/society-admin/dashboard");
        } else {
          if (isMounted) setTarget("/(tabs)/explore");
        }
      } catch {
        if (isMounted) setTarget("/(tabs)/explore");
      }
    }

    void checkRole();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!target) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAF9F5", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="small" color="#1E5D4B" />
      </View>
    );
  }

  return <Redirect href={target as any} />;
}
