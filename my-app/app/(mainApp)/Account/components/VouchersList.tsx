import { Voucher } from "@/app/types";
import EmptyVouchersState from "./EmptyVouchersState";
import VoucherItem from "./VoucherItem";

interface VouchersListProps {
    vouchers: Voucher[] | undefined;
    minimumPoints: number | string;
    userPoints: number;
}

const VouchersList = ({ vouchers, minimumPoints, userPoints }: VouchersListProps) => {
    if (!vouchers || vouchers.length === 0) {
        return <EmptyVouchersState minimumPoints={minimumPoints} userPoints={userPoints} />;
    }

    return (
        <div className="grid gap-4">
            {vouchers.map((voucher) => (
                <VoucherItem key={voucher.id} voucher={voucher} />
            ))}
        </div>
    );
};
export default VouchersList;