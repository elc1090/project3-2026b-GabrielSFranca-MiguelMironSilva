"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AdminUser,
  atualizarUsuarioAdmin,
  excluirUsuarioAdmin,
  estaAutenticado,
  listarUsuariosAdmin,
  obterUsuarioAtual,
  User,
} from "@/app/api/api";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<User | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!estaAutenticado()) {
      router.replace("/login");
      return () => { cancelled = true; };
    }

    async function loadAdmin() {
      try {
        const currentUser = await obterUsuarioAtual();
        if (!currentUser.is_superuser) {
          if (!cancelled) {
            setError("Esta área está disponível apenas para administradores.");
            router.replace("/perfil");
          }
          return;
        }
        const allUsers = await listarUsuariosAdmin();
        if (!cancelled) {
          setAdmin(currentUser);
          setUsers(allUsers);
        }
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Não foi possível carregar os usuários.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadAdmin();
    return () => { cancelled = true; };
  }, [router]);

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    if (!term) return users;
    return users.filter((user) =>
      `${user.username} ${user.email}`.toLocaleLowerCase("pt-BR").includes(term),
    );
  }, [query, users]);

  async function changeRole(user: AdminUser) {
    setBusyId(user.id);
    setError("");
    setNotice("");
    try {
      const updated = await atualizarUsuarioAdmin(user.id, {
        is_superuser: !user.is_superuser,
      });
      setUsers((current) => current.map((item) => item.id === updated.id ? updated : item));
      setNotice(`Permissão de ${updated.username} atualizada.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível atualizar a permissão.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteUser(user: AdminUser) {
    if (String(user.id) === String(admin?.id)) return;
    if (!window.confirm(`Excluir a conta de ${user.username}? Esta ação não pode ser desfeita.`)) return;
    setBusyId(user.id);
    setError("");
    setNotice("");
    try {
      await excluirUsuarioAdmin(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setNotice(`A conta de ${user.username} foi excluída.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível excluir o usuário.");
    } finally {
      setBusyId(null);
    }
  }

  function startEditing(user: AdminUser) {
    setEditingUser(user);
    setUsername(user.username);
    setEmail(user.email);
    setError("");
    setNotice("");
  }

  async function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingUser) return;
    setBusyId(editingUser.id);
    setError("");
    setNotice("");
    try {
      const updated = await atualizarUsuarioAdmin(editingUser.id, {
        username: username.trim(),
        email: email.trim(),
      });
      setUsers((current) => current.map((item) => item.id === updated.id ? updated : item));
      setEditingUser(null);
      setNotice(`Dados de ${updated.username} atualizados.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível atualizar os dados.");
    } finally {
      setBusyId(null);
    }
  }

  const adminCount = users.filter((user) => user.is_superuser).length;

  return (
    <main className={styles.page}>
      <nav className={styles.navigation} aria-label="Navegação administrativa">
        <Link href="/" className={styles.back}>← Voltar aos filmes</Link>
        <Link href="/perfil" className={styles.profileLink}>Meu perfil</Link>
      </nav>

      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>ÁREA RESTRITA</p>
          <h1>Painel administrativo</h1>
          <p>Olá, {admin?.username}. Gerencie as contas e permissões da plataforma.</p>
        </div>
        <span className={styles.badge}>Administrador</span>
      </header>

      {error && <p className={styles.error} role="alert">{error}</p>}
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      {loading && <p className={styles.message}>Carregando usuários…</p>}

      {!loading && admin && <>
        <section className={styles.stats} aria-label="Resumo de contas">
          <article><strong>{users.length}</strong><span>Usuários cadastrados</span></article>
          <article><strong>{adminCount}</strong><span>Administradores</span></article>
        </section>

        <section className={styles.usersSection}>
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>CONTAS</p><h2>Usuários</h2></div>
            <label className={styles.search}>
              <span className={styles.visuallyHidden}>Buscar usuário</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome ou e-mail"
              />
            </label>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>Usuário</th><th>E-mail</th><th>Permissão</th><th>Ações</th></tr></thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isSelf = String(user.id) === String(admin.id);
                  const isBusy = busyId === user.id;
                  return (
                    <tr key={user.id}>
                      {editingUser?.id === user.id ? (
                        <td colSpan={4}>
                          <form className={styles.editForm} onSubmit={saveUser}>
                            <label>Nome de usuário
                              <input minLength={3} maxLength={30} required value={username} onChange={(event) => setUsername(event.target.value)} />
                            </label>
                            <label>E-mail
                              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
                            </label>
                            <button type="submit" className={styles.primary} disabled={isBusy}>{isBusy ? "Salvando…" : "Salvar"}</button>
                            <button type="button" className={styles.secondary} disabled={isBusy} onClick={() => setEditingUser(null)}>Cancelar</button>
                          </form>
                        </td>
                      ) : <>
                        <td><strong>{user.username}</strong>{isSelf && <span className={styles.self}> (você)</span>}</td>
                        <td>{user.email}</td>
                        <td><span className={user.is_superuser ? styles.adminRole : styles.userRole}>{user.is_superuser ? "Administrador" : "Usuário"}</span></td>
                        <td>
                          <div className={styles.actions}>
                            <button type="button" className={styles.secondary} disabled={isBusy} onClick={() => startEditing(user)}>Editar</button>
                            <button type="button" className={styles.secondary} disabled={isBusy || isSelf} onClick={() => void changeRole(user)}>{user.is_superuser ? "Remover admin" : "Tornar admin"}</button>
                            <button type="button" className={styles.danger} disabled={isBusy || isSelf} onClick={() => void deleteUser(user)}>{isBusy ? "Aguarde…" : "Excluir"}</button>
                          </div>
                        </td>
                      </>}
                    </tr>
                  );
                })}
                {!filteredUsers.length && <tr><td className={styles.empty} colSpan={4}>Nenhum usuário encontrado.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className={styles.hint}>Sua própria conta não pode ser rebaixada nem excluída por este painel.</p>
        </section>
      </>}
    </main>
  );
}
