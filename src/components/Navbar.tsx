import Link from "next/link";
import { User, Search, Menu, LogOut } from "lucide-react";
import { auth } from "@/auth";
import { handleSignOut } from "@/actions/auth";
import styles from "./Navbar.module.css";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo}>
          Lumina
        </Link>
        <div className={styles.links}>
          <Link href="/search" className={styles.link}>Models</Link>
          <Link href="/locations" className={styles.link}>Locations</Link>
          <Link href="/news" className={styles.link}>News</Link>
          <Link href="/about" className={styles.link}>About</Link>
        </div>
        <div className={styles.actions}>
          <Link href="/search" className={styles.iconBtn}>
            <Search size={20} />
          </Link>
          
          {session ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>Hello, {session.user?.name?.split(' ')[0]}</span>
              <form action={handleSignOut}>
                <button type="submit" className={styles.logoutBtn}>
                  <LogOut size={18} />
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className={styles.loginBtn}>
              <User size={18} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
