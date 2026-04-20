import type { Expense, MemberBalance, TripMember } from "@/types";

export function calculateBalances(
  expenses: Expense[],
  members: TripMember[],
): MemberBalance[] {
  const paidMap = new Map<string, number>();
  const owesMap = new Map<string, number>();

  for (const member of members) {
    paidMap.set(member.id, 0);
    owesMap.set(member.id, 0);
  }

  for (const expense of expenses) {
    const paidBefore = paidMap.get(expense.paidByMemberId) ?? 0;
    paidMap.set(expense.paidByMemberId, paidBefore + expense.totalAmountCents);

    const splitCount = expense.splitAmong.length;
    if (splitCount === 0) continue;

    const baseShare = Math.floor(expense.totalAmountCents / splitCount);
    const remainder = expense.totalAmountCents % splitCount;

    expense.splitAmong.forEach((memberId, index) => {
      const share = baseShare + (index < remainder ? 1 : 0);
      const owesBefore = owesMap.get(memberId) ?? 0;
      owesMap.set(memberId, owesBefore + share);
    });
  }

  return members.map((member) => {
    const paid = paidMap.get(member.id) ?? 0;
    const owes = owesMap.get(member.id) ?? 0;
    return {
      memberId: member.id,
      memberName: member.name,
      net: paid - owes,
      owes,
      paid,
    };
  });
}
