import { CookieOptions, createServerClient, serialize } from "@supabase/ssr";
import { GetServerSidePropsContext } from "next";
import { supabaseKey, supabaseUrl } from "../constants";

function getServerSupabase(context: GetServerSidePropsContext) {
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return context.req.cookies[name];
      },
      set(name: string, value: string, options: CookieOptions) {
        context.res.appendHeader("Set-Cookie", serialize(name, value, options));
      },
      remove(name: string, options: CookieOptions) {
        context.res.appendHeader("Set-Cookie", serialize(name, "", options));
      },
    },
  });

  return supabase;
}

export default getServerSupabase;
