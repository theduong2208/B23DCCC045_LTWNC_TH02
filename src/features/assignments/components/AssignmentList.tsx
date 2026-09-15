import { withLoading } from '../../../hoc/withLoading';
import { AssignmentListBase } from './AssignmentListBase';

/**
 * Component thực tế được dùng trong app: AssignmentListBase bọc bởi HOC
 * withLoading, tự động hiển thị trạng thái loading/error trước khi render danh sách.
 */
export const AssignmentList = withLoading(AssignmentListBase);
